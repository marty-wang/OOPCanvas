(function(OC) {

    OC.installPlugin('easingEquationView', creator);

    // ====================================================
    
    function creator (left, top, width, height, equation, caption) {
        return new EasingEquationView(this, left, top, width, height, equation, caption);
    }

    function EasingEquationView (oc, left, top, width, height, equation, caption) {
        EasingEquationView.__super__.constructor.apply(this, arguments);
    
        this._width = width;
        this._height = height;
        this._equation = equation;
        this._caption = caption;

        this._points = _generatePoints(this);
    }

    OC.Util.inherit(EasingEquationView, OC.UIElement);
    
    EasingEquationView.prototype.draw = function() {
        var oc = this._oc;
        oc.drawRectangle(this._left, this._top, this._width, this._height, {
            'fillStyle': 'transparent',
            'strokeStyle': 'blue'
        });

        oc.drawLines(this._points, {
            'strokeStyle': 'red'
        });

        oc.drawText(this._left + 3, this._top, this._caption);

        EasingEquationView.__super__.draw.apply(this, arguments);
    };

    function _generatePoints (eeView) {
        var t = 0;
        var b = 0;
        var c = eeView._height;
        var d = eeView._width;

        var points = [];
        var p;
        var val;

        for ( t = 0; t <= d; t++) {
            p = [];
            val = eeView._equation(t, b, c, d);
            val = -val + eeView._top + eeView._height;
            p.push(t + eeView._left);
            p.push(val);
            points.push(p);
        }

        return points;
    }
    
    debug.info("easingEquationView plugin is installed.");
    
})(OOPCanvas);
