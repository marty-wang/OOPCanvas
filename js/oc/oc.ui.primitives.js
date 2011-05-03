//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.ui"

(function(OC) {

    var ui = OC.modules.ui;

    // == Rectangle Sub-module ==

    ui.rectangle = function (OC) {

        var fn = OC.prototype;
        
        // ++ Expose methods ++

        fn.rectangle = function(left, top, width, height, config) {
            return new Rectangle(this, left, top, width, height, config);
        };

        // ++ End of exposing methods ++
        
        // == Constructor ==

        function Rectangle (oc, left, top, width, height, config) {
            this.__super('constructor', oc, left, top);

            this._width = width;
            this._height = height;

            this._config = config;
            
            this._id = "Rect-" + OC.Util.rand();
        }

        OC.Util.inherit(Rectangle, OC.UIElement);
                
        Rectangle.prototype.draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
            
            this.__super('draw');
        };

        // == Constructor ==

        debug.info("ui module Rectangle submodule is installed.");
    };
    
    // == Background Sub-module ==

    ui.background = function (OC) {

        var fn = OC.prototype;

        fn.background = function(config) {
            return new Background(this, config);
        };

        function Background (oc, config) {
            this.__super('constructor', oc, 0, 0);

            this._width = oc.getWidth();
            this._height = oc.getHeight();
            this._zIndex = OC.UIElement.Min_ZIndex;
            this._config = config;
        }

        OC.Util.inherit(Background, OC.UIElement);

        Background.prototype.draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
            this.__super('draw');
        };
    };

    // == End of Background Sub-module ==

})(OOPCanvas);
