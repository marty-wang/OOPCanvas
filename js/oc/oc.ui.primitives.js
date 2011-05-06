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
        
        // == Constructor ==

        function Rectangle (oc, left, top, width, height, config) {
            this.__super('constructor', oc, left, top);

            this._width = width;
            this._height = height;

            this._config = config;
            
            this._id = "Rect-" + this._id;
        }

        OC.Util.inherit(Rectangle, OC.UIElement);
                
        Rectangle.prototype.draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
            
            this.__super('draw');
        };

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

        OC.UIElement.subClass(Background);

        Background.prototype._draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
        };
    };

    // == Button Sub-module ==
    
    ui.button = function (OC) {
        
        var fn = OC.prototype;

        fn.button = function(left, top) {
            return new Button(this, left, top);
        };

        function Button(oc, left, top) {
            this.__super('constructor', oc, left, top);
            this._id = "Button-" + this._id;
            
            this._gradientNormal = null;
            this._gradientHover = null;
            this._gradientPress = null;
            
            this.setSize(300, 50);
            this.setState(OC.UIElement.States.Normal);

            this._clickHandler = null;

            _registerEventHandlers(this);
        }

        OC.UIElement.subClass(Button);
        
        Button.prototype.setSize = function(width, height) {
            this._width = width;
            this._height = height;
            
            _createGradients(this);

            this.invalidate();
        };

        Button.prototype.setState = function(state) {
            this.__super('setState', state);
            this.invalidate();
        };

        Button.prototype.click = function(callback) {
            this._clickHandler = callback;
            //this.setState(OC.UIElement.States.Press);
        };

        Button.prototype._draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, {
                'fillStyle': _getCurGredient(this),
                'strokeStyle': 'transparent'
            });
            oc.drawLine(this._left, this._top, this._left + 20, this._top + 20);
        };

        Button.prototype._hitTest = function(x, y) {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, {
                'fillStyle': 'red',
                'strokeStyle': 'transparent'
            });
            return this.testPointInPath(x, y);
        };

        function _registerEventHandlers (button) {
            button.bind('click', function(sender, args) {
                button.setState(OC.UIElement.States.Press);
                if (!!button._clickHandler) {
                    button._clickHandler(sender, args);
                }
            });
        }

        function _createGradients (button) {
            var oc = button._oc;
            var stops = [
                [0, '#b8e1fc'], [0.1, '#a9d2f3'] , 
                [0.25, '#90bae4'], [0.37, '#90bcea'], 
                [0.5, '#90bff0'], [0.51, '#6ba8e5'],
                [0.83, '#a2daf5'], [1, '#bdf3fd']
            ];
            button._gradientNormal = oc.createLinearGradient(0, 0, 0, button._height, stops);

            stops = [
                [0, '#3b679e'], [0.5, '#2b88d9'],
                [0.51, '#207cca'], [1, '#7db9e8']
            ];

            button._gradientHover = oc.createLinearGradient(0, 0, 0, button._height, stops);

            stops = [
                [0, '#1E5799'], [0.5, '#2989D8'],
                [0.51, '#207cca'], [1, '#7db9e8']
            ];

            button._gradientPress = oc.createLinearGradient(0, 0, 0, button._height, stops);
        }

        function _getCurGredient (button) {
            return button['_gradient' + OC.UIElement.States[button._state]];
        }

    };

})(OOPCanvas);
