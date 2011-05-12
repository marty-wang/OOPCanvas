//= require "oc.util"
//= require "oc.runloop"
//= require "oc.core"
//= require "oc.ui"
//= require "oc.interaction"

// interfacts expected from ui child
// getId(), getZIndex(), update(), draw(), hitTest()

// TODO: instead of re-drawing everything every time a child becomes dirty
// Only re-draw the children and background overlapping the child in question
// in z-index

window.OOPCanvas.modules.visualManager = function _visualManager (OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    // ## init ##
    _visualManager.init = function(oc) {
        oc._visualManager = new VisualManager(oc);

        oc.installHook(function(oc) {
            oc._visualManager.render();
        });

        debug.info("visualManager module is init'ed.");
    };

    fn.addChild = function (child) {
        this._visualManager.addChild(child);
    };

    fn.addChildren = function (children) {
        this._visualManager.addChildren(children);
    };

    fn.removeChildById = function (id) {
        this._visualManager.removeChildById(id);
    };

    fn.removeChild = function (child) {
        this._visualManager.removeChild(child);
    };

    // children: array
    fn.removeChildren = function (children) {
        this._visualManager.removeChildren(children);
    };

    fn.removeAll = function () {
        this._visualManager.removeChildren();
    };

    // ++ End of Adding Methods to OOPCanvas ++
    
    // ====================
    // == Visual Manager ==
    // ====================

    function VisualManager (oc) {
        this._oc = oc;

        this._children = new OC.Collections.Dict(function(c1, c2) {
            return c1.getZIndex() - c2.getZIndex();
        });

        this._isDirty = true;
        this._hitTestResults = [];
        this._lastHitTestElement = null;
    }

    VisualManager.prototype.addChild = function (child) {
        var id = child.getId();
        this._children.add(id, child);
        this._isDirty = true;
    };

    VisualManager.prototype.addChildren = function(children) {
        var kvs = [];
        var i, child, kv;
        var count = children.length;

        for ( i = 0; i < count; i++ ) {
            child = children[i];
            kv = [ child.getId(), child ];
            kvs.push(kv);
        }

        this._children.addItems(kvs);
        this._isDirty = true;
    };

    VisualManager.prototype.removeChildById = function (id) {
        if ( this._children.contain(id) ) {
            this._children.remove(id);
            this._isDirty = true;
        }
    };

    VisualManager.prototype.removeChild = function (child) {
        var id = child.getId();
        this.removeChildById(id);
    };

    VisualManager.prototype.removeChildren = function(children) {
        this._isDirty = true;

        if (typeof children === "undefined") {
            this._children.removeAll();
            return;
        }

        var ids = [];
        var i, child;
        var count = children.length;
        
        for ( i = 0; i < count; i++) {
            child = children[i];
            ids.push(child.getId());
        }

        this._children.removeItems(ids);
    };
    
    VisualManager.prototype.render = function() {
        _hitTest(this);
        
        if ( _update(this) ) {
            _clear(this);
            _draw(this);
            this._isDirty = false;
        }
    };

    function _hitTest (vm) {
        var oc = vm._oc;
        var evt = oc._dequeueEvent();
        var hit;

        // no point to test hit if there is no event at all
        if (!evt) {
            return;
        }

        var htrs = vm._hitTestResults;
        htrs.length = 0;
        vm._children.iterate(function(key, child) {
            var hr = child.hitTest(evt.left, evt.top);
            if ( !!hr ) {
                hr.event = evt;
                htrs.unshift(hr);
            }
        }); 

        hit = htrs[0];
        htrs.length = 0;

        var lastHTElm = vm._lastHitTestElement;

        if ( !!lastHTElm && ( !hit || lastHTElm.getId() != hit.element.getId() ) ) {
            _sendEvent(vm._lastHitTestElement, 'mouseout');
        }
        
        if ( !!hit ) {
            var elm = hit.element;
            var eventType = hit.event.type;

            if ( eventType === "mousemove" && ( !lastHTElm || lastHTElm.getId() != hit.element.getId() ) ) {
                hit.event.type = "mouseover";
            }

           _sendEvent(elm, hit.event.type);
        }

        vm._lastHitTestElement = !!hit ? hit.element : null;
    }

    function _sendEvent (element, eventName) {
        element["_" + eventName]();
    }
        
    // determine if it should re-render
    // based on if the child is dirty
    function _update (vm) {
        var isDirty = vm._isDirty;
        var curTime = new Date().getTime();
        vm._children.iterate(function(key, child) { 
            isDirty |= child.update(curTime);
        });
        return !!isDirty;
    }

    function _clear (vm) {
        var oc = vm._oc;
        oc.clearAll(); 
    }
    
    function _draw (vm) {
        vm._children.iterate(function(key, child) {
            child.draw();
        });
    }

    // ===========================
    // == End of Visual Manager ==
    // ===========================

    debug.info("visualManager module is installed.");
};

