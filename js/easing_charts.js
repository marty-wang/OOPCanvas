$(document).ready(function() {
    var canvas = document.getElementById('oopcanvas');
    var oc = OC.create(canvas, {
        'showDebugInfo': true
    });
    oc.startRunloop();

    var size = oc.getSize();
    var w = size.width;
    var h = size.height;

    var gutter = 20;

    var left0 = 20;
    var top0 = 20;
    var cw = 260;
    var ch = 150;

    var fk;
    var funcs = OC.Animator.easingFunctions;
    var l = left0;
    var t = top0;

    for (fk in funcs) {

        if ( l + cw > w ) {
            l = left0;
            t = t + ch + gutter;
        }
        
        var func = funcs[fk];
        var chart = oc.easingEquationView(l, t, cw, ch, func, fk);
        oc.addChild(chart);
        
        l = l + cw + gutter;
    }

});

(function(OC) {

    OC.installPlugin('easingEquationView', plugin);

    function plugin (left, top, width, height, equation, caption) {
        return new EasingEquationView(this, left, top, width, height, equation, caption);
    }

    function EasingEquationView (oc, left, top, width, height, equation, caption) {
        EasingEquationView.__super(this, 'constructor', oc);
    
        this._left = left;
        this._top = top;
        this._width = width;
        this._height = height;
        this._equation = equation;
        this._caption = caption;

        this._isHitTestVisible = false;

        this._points = _generatePoints(this);
    }

    OC.Util.inherit(EasingEquationView, OC.UIElement);
    
    EasingEquationView.prototype._draw = function() {
        var oc = this._oc;
        oc.drawRectangle(this._left, this._top, this._width, this._height, {
            'fillStyle': 'transparent',
            'strokeStyle': 'blue'
        });

        oc.drawLines(this._points, {
            'strokeStyle': 'red'
        });

        oc.drawText(this._left + 3, this._top, this._caption);
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
    
})(OOPCanvas);
