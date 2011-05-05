//= require "oc.bootstrapper"
//= require "oc.core"

window.OOPCanvas.modules.interaction = function _interaction (OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    _interaction.init = function (oc) {
        oc._interaction = new Interaction(oc);

        debug.info("interaction module is init'ed.");
    };

    // ++ Add Methods ++

    fn.hitTest = function(element, x, y) {
        return this._interaction.hitTest(element, x, y);
    };

    fn.getHitTestContext = function() {
        return this._interaction.getHitTestContext();
    };
    
    // ++ End of Adding methods ++

    // == Interaction Class ==

    function Interaction (oc) {
        this._oc = oc;
        this._canvas = this._oc.getCanvas();

        this._hitTestCtx = null;

        this._events = []; // queue-ish, first-in-first-out

        _createHiTestContext(this);        
        _registerEventHandlers(this);
    }

    Interaction.prototype.getHitTestContext = function() {
        return this._hitTestCtx;
    };

    Interaction.prototype.hitTest = function(element, x, y) {
        var ctx = this._hitTestCtx;
        var result = null;
        if ( ctx.isPointInPath(x, y) ) {
            result = {
                'element': element,
                'point': [x, y]
            };
        }
        return result;
    };

    Interaction.prototype.dequeueEvent = function() {
        return _dequeueEvent(this);
    };

    function _createHiTestContext (ia) {
        var oc = ia._oc;
        var buffer = document.createElement('canvas');
        buffer.width = oc.getWidth();
        buffer.height = oc.getHeight();
        ia._hitTestCtx = buffer.getContext('2d');
    }

    function _registerEventHandlers (ia) {
        var canvas = ia._canvas;

        // canvas.addEventListener('mousemove', function(evt) {
        //     _onmousemove(ia, evt);
        // }, false);

        canvas.addEventListener('click', function(evt) {
            evt = evt = !evt ? window.event : evt;
            _onclick(ia, evt);
        }, false);


        // canvas.onmouseover = function (evt) {
        //     //debug.debug("on mouse over");
        // };

        // canvas.onmouseout = function (evt) {
        //     //debug.debug("on mouse out");
        // };

        // canvas.onmousedown = function (evt) {
        //     //debug.debug("on mouse down");
        // };

        // canvas.onmouseup = function (evt) {
        //     //debug.debug("on mouse up");
        // };
    }
    
    function _enqueueEvent (ia, event) {
        ia._events.push(event);
    }

    function _dequeueEvent (ia) {
        return ia._events.shift();
    }

    // == Event handlers ==

    function _onmousemove (ia, evt) {
        debug.debug("on mouse move");
        _enqueueEvent(ia, evt);
    }

    function _onclick (ia, evt) {
        debug.debug("on click");
        _enqueueEvent(ia, evt);
    }

    debug.info("interaction module is installed.");
};
