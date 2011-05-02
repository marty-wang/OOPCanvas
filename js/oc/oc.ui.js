//= require "oc.core"
//= require "oc.drawing"
//= require "oc.util"

(function() {
   
    var ui = window.OOPCanvas.modules.ui = {};
    
    ui.uiElement = function (OOPCanvas) {
        
        // TODO: not sure if width and height should be defined in UIElement
        function UIElement(oc, left, top) {
            this._oc = oc;
            this._left = left;
            this._top = top;
            this._id = OC.Util.rand();
            this._zIndex = 0;
        }

        UIElement.prototype.getId = function() {
            return this._id;
        };
        
        UIElement.prototype.getZIndex = function() {
            return this._zIndex;
        };

        UIElement.prototype.setZIndex = function(index) {
            this._zIndex = index;
        };

        UIElement.prototype.setPosition = function(left, top) {
            this._left = left;
            this._top = top;
        };

        UIElement.prototype.update = function(currentTime) {
        };

        UIElement.prototype.draw = function() {
        };

        OOPCanvas.UIElement = UIElement;

        debug.info("ui module UIElement submodule is installed.");
    };

    // Animatable Properties
    // left/x, top/y
    // width, height

    //var AnimProps = ['left', 'top'];

    ui.rectangle = function (OOPCanvas) {

        var OC = OOPCanvas;
        var fn = OC.prototype;
        
        fn.rectangle = function(left, top, width, height, config) {
            return new Rectangle(this, left, top, width, height, config);
        };

        function Rectangle (oc, left, top, width, height, config) {
            OC.UIElement.call(this, oc, left, top);

            this._width = width;
            this._height = height;

            this._config = config;
            
            this._id = "Rect-" + OC.Util.rand();

            // animation
            
            this._animator = this._oc.animator(this);
        }

        OC.Util.inherit(Rectangle, OC.UIElement);

        Rectangle.prototype.update = function(currentTime) {
            
            this._animator.update(currentTime);
        };
        
        Rectangle.prototype.draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
        };

        Rectangle.prototype.animate = function(props, duration, easingFunc) {
            this._animator.start(props, duration, easingFunc);
        };

        debug.info("ui module Rectangle submodule is installed.");
    };

})();
