//= require "oc.util"
//= require "oc.runloop"
//= require "oc.core"
//= require "oc.ui"

// interfacts expected from ui child
// getId(), getZIndex(), update(), draw()

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

    // ++ Add Methods to OOPCanvas ++

    fn.addChild = function (child) {
        this._visualManager.addChild(child);
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

        this._children = new OC.Dict(function(c1, c2) {
            return c1.getZIndex() - c2.getZIndex();
        });

        this._isDirty = true;
    }

    VisualManager.prototype.addChild = function (child) {
        var id = child.getId();
        if ( this._children.contain(id) ) {
            throw 'UIElement "' + id + '" already exists';
        }

        this._children.add(id, child);
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
        if ( _update(this) ) {
            _clear(this);
            _draw(this);
            this._isDirty = false;
        }
    };
    
    // determine if it should re-render
    // based on if the child is dirty
    function _update (vm) {
        var isDirty = vm._isDirty;
        var curTime = new Date().getTime();
        vm._children.iterate(function(key, child) {
            isDirty |= child.update(curTime);
        });
        return isDirty;
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

