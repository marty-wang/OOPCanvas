//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.ui"

(function(OC) {

    var ui = OC.modules.ui;

    // == Rectangle Sub-module ==

    ui.rectangle = function (OC) {

        var fn = OC.prototype;
        
        // ++ Add methods ++

        fn.rectangle = function(left, top, width, height, config) {
            return new Rectangle(this, left, top, width, height, config);
        };

        // ++ End of Adding Methods ++
        
        // == Constructor ==

        function Rectangle (oc, left, top, width, height, config) {
            this.__super('constructor', oc);

            this._left = left;
            this._top = top;
            this._width = width;
            this._height = height;

            this._config = config;
            
            this._id = "Rect-" + this._id;
        }

        OC.Util.inherit(Rectangle, OC.UIElement);
                
        Rectangle.prototype._draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
        };

        debug.info("ui module Rectangle submodule is installed.");
    };

    // == Polygon Sub-module == 

    ui.polygon = function (OC) {
        var fn = OC.prototype;

        fn.polygon = function(centerX, centerY, radius, sides, config) {
            return new Polygon(this, centerX, centerY, radius, sides, config);
        };

        function Polygon (oc, centerX, centerY, radius, sides, config) {
            this.__super('constructor', oc);

            this._centerX = centerX;
            this._centerY = centerY;
            this._radius = radius;
            this._sides = sides;
            this._config = config;
        }

        OC.UIElement.subClass(Polygon);

        Polygon.prototype.setSides = function(sides) {
            this._sides = sides;
            this.invalidate();
        };

        Polygon.prototype.getSides = function() {
            return this._sides;
        };

        Polygon.prototype._draw = function() {
            var oc = this._oc;
            oc.drawPolygon(this._centerX, this._centerY, this._radius, this._sides, this._config);
        };

        Polygon.prototype._hitTest = function(x, y) {
            var oc = this._oc;
            oc.drawPolygon(this._centerX, this._centerY, this._radius, this._sides);
            return this.testPointInPath(x, y);
        };

        debug.info("ui module polygon submodule is installed.");
    };
    
    // == Background Sub-module ==

    ui.background = function (OC) {

        var fn = OC.prototype;

        fn.background = function(config) {
            return new Background(this, config);
        };

        function Background (oc, config) {
            this.__super('constructor', oc);

            this._left = 0;
            this._top = 0;
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
            this.__super('constructor', oc);
            this._id = "Button-" + this._id;
            
            this._left = left;
            this._top = top;

            this._gradientNormal = null;
            this._gradientHover = null;
            this._gradientPress = null;
            
            this.setSize(300, 50);
            this._state = Button.States.Normal;
        }

        OC.UIElement.subClass(Button);

        Button.States = {
            'Normal': 'Normal',
            'Hover': 'Hover',
            'Press': 'Press'
        };
        
        Button.prototype.setSize = function(width, height) {
            this._width = width;
            this._height = height;
            
            _createGradients(this);

            this.invalidate();
        };

        Button.prototype.click = function(callback) {
            this.bind('click', callback);
        };
        
        // Override Methods

        Button.prototype._draw = function() {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, {
                'fillStyle': _getCurGredient(this),
                'strokeStyle': 'transparent',
                'cornerRadius': 6
            });
            oc.drawLine(this._left, this._top, this._left + 20, this._top + 20);
        };

        Button.prototype._hitTest = function(x, y) {
            var oc = this._oc;
            oc.drawRectangle(this._left, this._top, this._width, this._height, {
                'fillStyle': 'red', // it can be any color, it is only used for hittest, and not visible anyway
                'strokeStyle': 'transparent'
            });
            return this.testPointInPath(x, y);
        };

        // == Event Handlers ==

        Button.prototype._click = function() {
            this.__super('_click');
        };

        Button.prototype._mouseover = function() {
            this._oc.changeCursor('pointer');
            _setState(this, Button.States.Hover);
            this.__super('_mouseover');      
        };

        Button.prototype._mousemove = function() {
            this.__super('_mousemove');
        };

        Button.prototype._mouseout = function() {
            this._oc.changeCursor('default');
            _setState(this, Button.States.Normal);
            this.__super('_mouseout');
        };

        // == Private ==
        
        function _setState (button, state) {
            if ( button._state === state ) {
                return;
            }

            button._state = state;
            button.invalidate();
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
            return button['_gradient' + Button.States[button._state]];
        }

    };

})(OOPCanvas);
