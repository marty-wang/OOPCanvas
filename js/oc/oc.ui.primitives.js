//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.ui"

(function(OC) {

    /**
     * @namespace The collection of all the UI primitives
     */
    OC.UIPrimitives = {};

    // == Augment OOPCanvas ==

    OC.UIPrimitives.Rectangle = Rectangle;    
    OC.UIPrimitives.Polygon = Polygon;    
    OC.UIPrimitives.Path = Path;

    OC.UIPrimitives.Background = Background;

    /**
     */
    OC.prototype.rectangle = function(left, top, width, height) {
        return new Rectangle(this, left, top, width, height);
    };

    /**
     */
    OC.prototype.polygon = function(centerX, centerY, radius, sides) {
        return new Polygon(this, centerX, centerY, radius, sides);
    };

    /**
     */
    OC.prototype.path = function(left, top, pathData) {
        return new Path(this, left, top, pathData);
    };

    /**
     */
    OC.prototype.background = function(config) {
        return new Background(this, config);
    };

    // == Rectangle ==

    /**
     * @name Rectangle
     * @exports Rectangle as OOPCanvas.UIPrimitives.Rectangle
     * @class
     */
    function Rectangle (oc, left, top, width, height) {
        Rectangle.__super(this, 'constructor', oc);

        this._left = left;
        this._top = top;
        this._width = width;
        this._height = height;
        
        this._id = "Rect-" + this._id;
    }

    OC.Util.inherit(Rectangle, OC.UIElement);
            
    Rectangle.prototype._draw = function() {
        var oc = this._oc;
        oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
    };

    Rectangle.prototype._hitTest = function(x, y) {
        var oc = this._oc;
        oc.drawRectangle(this._left, this._top, this._width, this._height);
        return this.testPointInPath(x, y);
    };

    // == Polygon == 

    /**
     * @name Polygon
     * @exports Polygon as OOPCanvas.UIPrimitives.Polygon
     * @class
     */
    function Polygon (oc, centerX, centerY, radius, sides) {
        Polygon.__super(this, 'constructor', oc);

        this._centerX = centerX;
        this._centerY = centerY;
        this._radius = radius;
        this._sides = sides;
    }

    OC.Util.inherit(Polygon, OC.UIElement); 

    /**
     */
    Polygon.prototype.setSides = function(sides) {
        this._sides = sides;
        this.invalidate();
    };

    /**
     */
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


    // == Path ==

    /**
     * @name Path
     * @exports Path as OOPCanvas.UIPrimitives.Path
     * @class
     */
    function Path (oc, left, top, pathData) {
        Path.__super(this, 'constructor', oc);
        
        this._left = left;
        this._top = top;
        this._pathData = pathData;
    }

    OC.Util.inherit(Path, OC.UIElement);
    
    Path.prototype._draw = function() {
        var oc = this._oc;
        oc.drawPath(this._left, this._top, this._pathData, this._config);
    };

    Path.prototype._hitTest = function(x, y) {
        this._oc.drawPath(this._left, this._top, this._pathData);
        return this.testPointInPath(x, y);
    };

    // TODO: needs to refactor it out    
    // == Background ==

    /**
     * @name Background
     * @exports Background as OOPCanvas.UIPrimitives.Background
     * @class
     */
    function Background (oc, config) {
        Background.__super(this, 'constructor', oc);

        this._left = 0;
        this._top = 0;
        var size = oc.getSize();
        this._width = size.width;
        this._height = size.height;
        this._zIndex = OC.UIElement.Min_ZIndex;
        this._config = config;
    }

    OC.Util.inherit(Background, OC.UIElement);

    Background.prototype._draw = function() {
        var oc = this._oc;
        oc.drawRectangle(this._left, this._top, this._width, this._height, this._config);
    };
    
})(OOPCanvas);
