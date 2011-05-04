//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.drawing"
//= require "oc.animation"

// UIElement is the base class of all visual elements on the canvas.
// It is responsible for animation, interaction, event, update, render

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

            this._animator = null;
            this._isDirty = true;
        }

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

        UIElement.prototype.animate = function(props, duration, easingFunc) {
            if ( !this._animator ) {
                this._animator = this._oc.animator(this); 
            }

            this._animator.start(props, duration, easingFunc);
        };

        // == Method to override ==

        UIElement.prototype.update = function(currentTime) {
            if (!!this._animator) {
                this._isDirty |= this._animator.update(currentTime);
            }

            return !!this._isDirty;
        };

        // all the sub-classes must call this method, and
        // this method should be called at the end after sub-classes' logic
        UIElement.prototype.draw = function() {
            this._isDirty = false;
        };

        UIElement.prototype.hitTest = function(x, y) {
            var oc = this._oc; 
            var tr = oc.hitTest(this, [x, y]);
            //debug.debug(tr);
            return tr;
        };

        // == End of Methods to override ==

        OOPCanvas.UIElement = UIElement;

        debug.info("ui module UIElement submodule is installed.");
    };

})();
