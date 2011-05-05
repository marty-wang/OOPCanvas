//= require "oc.bootstrapper"
//= require "oc.core"

window.OOPCanvas.modules.interaction = function _interaction (OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    _interaction.init = function (oc) {
        oc._interaction = new Interaction(oc);

        debug.info("interaction module is init'ed.");
    };

    // == Interaction Class ==

    function Interaction (oc) {
        this._oc = oc;
        this._canvas = this._oc.getCanvas();

        this._hitTestCtx = null;

        this._events = []; // queue-ish, first-in-first-out

        _createHiTestContext(this);        
        _registerEventHandlers(this);
    }

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

        canvas.addEventListener('mousemove', function(evt) {
            _onmousemove(ia, evt);
        }, false);

        canvas.addEventListener('click', function(evt) {
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
        evt = !evt ? window.event : evt;
        _enqueueEvent(ia, evt);
    }

    function _onclick (ia, evt) {
        debug.debug("on click");
        evt = !evt ? window.event : evt;
        _enqueueEvent(ia, evt);
    }

    debug.info("interaction module is installed.");
};
