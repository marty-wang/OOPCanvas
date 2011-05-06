//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.drawing"
//= require "oc.animation"
//= require "oc.interaction"
//= require "oc.eventEmitter"

// UIElement is the base class of all visual elements on the canvas.
// It is responsible for animation, hittest, event, update, render

(function() {
   
    var ui = window.OOPCanvas.modules.ui = {};
    
    ui.uiElement = function (OOPCanvas) {
        
        function UIElement(oc, left, top) {
            this._oc = oc;
            this._left = left;
            this._top = top;
            this._id = OC.Util.rand();
            this._zIndex = 0;
            this._state = UIElement.States.Normal;

            this._eventEmitter = this._oc.eventEmitter();
            this._animator = null;
            this._isDirty = true;
            this._isHitTestVisible = true;
        }

        // Static

        UIElement.Max_ZIndex = Number.MAX_VALUE;
        UIElement.Min_ZIndex = -UIElement.Max_ZIndex;

        UIElement.States = {
            'Normal': 'Normal',
            'Hover': 'Hover',
            'Press': 'Press'
        };
        
        UIElement.subClass = function (subClass) {
            OC.Util.inherit(subClass, UIElement);
        };

        // Instance

        UIElement.prototype.getId = function() {
            return this._id;
        };
        
        UIElement.prototype.getZIndex = function() {
            return this._zIndex;
        };

        UIElement.prototype.setZIndex = function(index) {
            this._zIndex = index;

            this.invalidate();
        };

        UIElement.prototype.setState = function(state) {
            this._state = state;
        };

        UIElement.prototype.invalidate = function() {
            this._isDirty = true;
        };

        UIElement.prototype.isDirty = function() {
            return this._isDirty;
        };

        UIElement.prototype.setPosition = function(left, top) {
            this._left = left;
            this._top = top;
            
            this.invalidate();
        };

        UIElement.prototype.bind = function(eventName, callback) {
            this._eventEmitter.subscribe(eventName, callback);
        };

        UIElement.prototype.unbind = function(eventName, callback) {
            this._eventEmitter.unsubscribe(eventName, callback);
        };

        UIElement.prototype.fire = function(eventName, eventArgs) {
            this._eventEmitter.fire(this, eventName, eventArgs);
        };

        UIElement.prototype.animate = function(props, duration, easingFunc) {
            if ( !this._animator ) {
                this._animator = this._oc.animator(this); 
            }

            this._animator.start(props, duration, easingFunc);
        };

        UIElement.prototype.update = function(currentTime) {
            return this._update(currentTime);
        };

        UIElement.prototype.draw = function() {
            this._draw();
            this._isDirty = false;
        };

        UIElement.prototype.hitTest = function(x, y) {
            if ( !this._isHitTestVisible ) {
                return null;
            }

            var oc  = this._oc;
            var w = oc.getWidth();
            var h = oc.getHeight();
            var ctx = oc.getHitTestContext();
            ctx.clearRect(0, 0, w, h);

            // swap the rendering context with the hittest context
            var tmp = oc.getContext;
            oc.getContext = function() {
                return ctx;
            };

            var result = this._hitTest(x, y);
            
            oc.getContext = tmp;

            return result;        
        };

        UIElement.prototype.testPointInPath = function(x, y) {
            return this._oc.hitTest(this, x, y);
        };

        // == Method to override ==

        UIElement.prototype._update = function(currentTime) {
            if (!!this._animator) {
                this._isDirty |= this._animator.update(currentTime);
            }

            return !!this._isDirty;
        };

        // all the sub-classes must call this method, and
        // this method should be called at the end after sub-classes' logic
        UIElement.prototype._draw = function() {};
        
        // sub-class needs to implement this method
        // if it needs to participant to the hittest
        UIElement.prototype._hitTest = function(x, y) {};

        // == End of Methods to override ==

        OOPCanvas.UIElement = UIElement;

        debug.info("ui module UIElement submodule is installed.");
    };

})();
