//= require "oc.bootstrapper"
//= require "oc.core"

// TODO: this module is also responsible for normalize the cross browser event
// handling

(function (OC) {

    // ## init ##

    OC.initialize( function (oc) {
        oc._interaction = new Interaction(oc);

        debug.info("interaction module is init'ed.");
    });

    // ++ Augment OOPCanvas ++
    // These are protected methods and meant to be used internally across
    // 1st-party modules.

    var fn = OC.prototype;

    fn._dequeueEvent = function () {
        return this._interaction.dequeueEvent();
    };

    fn._hitTest = function(element, x, y) {
        return this._interaction.hitTest(element, x, y);
    };

    fn._getHitTestContext = function() {
        return this._interaction.getHitTestContext();
    };
    
    // == Interaction ==
    

    /**
     * @name Interaction
     * @class This class handles the interaction with users. <br/><br/>
     * <i>This class is <b>NOT</b> exposed for public use, as it functions as 
     * a singleton per OOPCanvas instance, and is managed by its OOPCanvas 
     * instance. However, it adds functions to OOPCanvas, which in turn interacts with
     * other 1st-party modules.</i>
     */

    function Interaction (oc) {
        this._oc = oc;
        this._canvas = oc.getCanvas();
        this._refPoint = oc.getPosition();

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
        var size = oc.getSize();
        buffer.width = size.width;
        buffer.height = size.height;
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
	    return [ posx - refPoint.left, posy - refPoint.top ];
    }

    debug.info("interaction module is installed.");

})(OOPCanvas);
