//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.drawing"
//= require "oc.animation"
//= require "oc.interaction"
//= require "oc.eventEmitter"

// UIElement is the base class of all visual elements on the canvas.
// It is responsible for animation, hittest, event, update, render

// Suppored Events: click, mouseover, mousemove, mouseout

(function() {
   
    var ui = window.OOPCanvas.modules.ui = {};
    
    ui.uiElement = function (OOPCanvas) {
        
        function UIElement(oc) {
            this._oc = oc;

            this._id = OC.Util.rand();
            this._zIndex = 0;

            this._left = null;
            this._top = null;
            this._centerX = null;
            this._centerY = null;
            this._config = null;
            
            this._isDirty = true;
            this._isHitTestVisible = true;
        
            this._eventEmitter = this._oc.eventEmitter();
            this._animator = null;
        }

        // Expose UIElement for inheritance
        OOPCanvas.UIElement = UIElement;

        // Static

        UIElement.Max_ZIndex = Number.MAX_VALUE;
        UIElement.Min_ZIndex = -UIElement.Max_ZIndex;
        
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

        UIElement.prototype.invalidate = function() {
            this._isDirty = true;
        };

        UIElement.prototype.isDirty = function() {
            return this._isDirty;
        };

        UIElement.prototype.setHitTestVisible = function(hitTestVisible) {
            this._isHitTestVisible = hitTestVisible;
        };

        UIElement.prototype.config = function(property, value) { 
            if ( !this._config ) {
                this._config = {};
            }

            if ( typeof property === "object" ) {
                var oc = this._oc;
                oc.updateConfig(this._config, property);
            } else {
                this._config[property] = value;
            }

            this.invalidate();
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

        // shortcuts for binding event handlers
        UIElement.prototype.click = function(callback) {
            this.bind('click', callback); 
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
            var size = oc.getSize();
            var w = size.width;
            var h = size.height;
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

        // == Method to Override ==

        UIElement.prototype._update = function(currentTime) {
            if (!!this._animator) {
                this._isDirty |= this._animator.update(currentTime);
            }

            return !!this._isDirty;
        };

        // all the sub-classes must call this method
        UIElement.prototype._draw = function() {};
        
        // sub-class needs to implement this method
        // if it needs to participant to the hittest
        UIElement.prototype._hitTest = function(x, y) {};

        // -- Event Handlers --
        // Override the evenhanlder if subclass wants custom action
        // before the event fires up

        UIElement.prototype._click = function() {
            this.fire('click');
        };

        UIElement.prototype._mouseover = function() {
            this.fire('mouseover');
        };

        UIElement.prototype._mousemove = function() {
            this.fire('mousemove');
        };

        UIElement.prototype._mouseout = function() {
            this.fire('mouseout');
        };

        UIElement.prototype._mousedown = function() {
            this.fire('mousedown');
        };

        UIElement.prototype._mouseup = function() {
            this.fire('mouseup');
        };

        // == End of Methods to Override ==
        
        debug.info("ui module UIElement submodule is installed.");
    };

})();
