//= require "oc.bootstrapper"
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

            this._animator = null;
            this._isDirty = true;
        }

        UIElement.prototype.getId = function() {
            return this._id;
        };
        
        UIElement.prototype.getZIndex = function() {
            return this._zIndex;
        };

        UIElement.prototype.setZIndex = function(index) {
            this._zIndex = index;

            this._isDirty = true;
        };

        UIElement.prototype.isDirty = function() {
            return this._isDirty;
        };

        UIElement.prototype.setPosition = function(left, top) {
            this._left = left;
            this._top = top;

            this._isDirty = true;
        };

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

        UIElement.prototype.animate = function(props, duration, easingFunc) {
            if ( !this._animator ) {
                this._animator = this._oc.animator(this); 
            }

            this._animator.start(props, duration, easingFunc);
        };

        OOPCanvas.UIElement = UIElement;

        debug.info("ui module UIElement submodule is installed.");
    };

    // == Rectangle Sub-module

    ui.rectangle = function (OOPCanvas) {

        var OC = OOPCanvas;
        var fn = OC.prototype;
        
        fn.rectangle = function(left, top, width, height, config) {
            return new Rectangle(this, left, top, width, height, config);
        };

        function Rectangle (oc, left, top, width, height, config) {
            Rectangle.__super__.constructor.apply(this, arguments);

            this._width = width;
            this._height = height;

            this._config = config;
            
            this._id = "Rect-" + OC.Util.rand();
        }

        OC.Util.inherit(Rectangle, OC.UIElement);
                
        Rectangle.prototype.draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
            
            Rectangle.__super__.draw.apply(this, arguments);
        };

        debug.info("ui module Rectangle submodule is installed.");
    };

})();
