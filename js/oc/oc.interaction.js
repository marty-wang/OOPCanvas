//= require "oc.bootstrapper"
//= require "oc.core"

// TODO: this module is also responsible for normalize the cross browser event
// handling

window.OOPCanvas.modules.interaction = function _interaction (OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    _interaction.init = function (oc) {
        oc._interaction = new Interaction(oc);

        debug.info("interaction module is init'ed.");
    };

    // ++ Add Methods ++

    fn.dequeueEvent = function () {
        return this._interaction.dequeueEvent();
    };

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
        this._refPoint = [ oc.getLeft(), oc.getTop() ];

        this._hitTestCtx = null;

        this._events = []; // queue-ish, first-in-first-out

        _createHitTestContext(this);        
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

    function _createHitTestContext (ia) {
        var oc = ia._oc;
        var buffer = document.createElement('canvas');
        buffer.width = oc.getWidth();
        buffer.height = oc.getHeight();
        ia._hitTestCtx = buffer.getContext('2d');
    }

    var events = ["click", "mousemove", "mousedown", "mouseup"];

    function _registerEventHandlers (ia) {
        var canvas = ia._canvas;

        // Be careful with mouseover and mouseout of canvas
        // because they may or may not intervene with
        // the same-named event relay to UIElement.
        
        for ( var i = 0, count = events.length ; i < count; i++ ) {
            _bind(canvas, events[i], function(evt){
                //debug.debug("interaction: " + evt.type);
                _enqueueEvent(ia, evt);
            });
        }
    }

    // == Event handlers ==

    function _onmousemove (ia, evt) {
        debug.debug("interaction: on mouse move");
        _enqueueEvent(ia, evt);
    }

    function _onclick (ia, evt) {
        debug.debug("interaction: on click");
        _enqueueEvent(ia, evt);
    }

    // == Private ==

    // TODO: normalize event handling
    function _bind (canvas, eventName, handler) {
        canvas.addEventListener(eventName, handler, false);
    }
    
    // TODO: normalize event 
    function _enqueueEvent (ia, event) {
        event = !event ? window.event : event;
        var relPoint = _getRelativePoint(event, ia._refPoint);
        var evt = {
            'type': event.type,
            'left': relPoint[0],
            'top': relPoint[1]
        };
        ia._events.push(evt);
    }

    function _dequeueEvent (ia) {
        return ia._events.shift();
    }

    function _getRelativePoint(e, refPoint) {
	    var posx = 0;
	    var posy = 0;
	    if (e.pageX || e.pageY) {
		    posx = e.pageX;
		    posy = e.pageY;
	    } else if (e.clientX || e.clientY) {
		    posx = e.clientX + document.body.scrollLeft;
		    posy = e.clientY + document.body.scrollTop;
	    }
	    return [ posx - refPoint[0], posy - refPoint[1] ];
    }

    debug.info("interaction module is installed.");
};
