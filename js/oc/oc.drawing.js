//= require "oc.core"
//= require "oc.util"

window.OOPCanvas.modules.drawing = function _drawing (OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OOPCanvas.prototype;

    // ++ Add Methods ++
    
    fn.updateConfig = function (config, updates) {
        OC.Util.merge(config, updates, true, _EXCLUDES);
    };

    // stops: array, stop[0]: position, stop[1]: color
    fn.createLinearGradient = function (x0, y0, x1, y1, stops) {
        var ctx = this.getContext();
        var lingrad = ctx.createLinearGradient(x0, y0, x1, y1);

        var i, stop;
        var count = stops.length;

        for ( i = 0; i < count; i++ ) {
            stop = stops[i];
            lingrad.addColorStop(stop[0], stop[1]);
        } 
                
        return lingrad;
    };
    
    // ++ End of Adding Methods ++

    // const
    var _EXCLUDES = ['rotate', 'translate', 'scale', 'transform'];

    var _config = {
        'textBaseline':  'top',
        'font':          '14px sans-serif'
    };

    _drawing.init = function(oc) {
        var gConfig = oc.getGlobalConfig();
        OC.Util.sync(_config, gConfig);

        debug.info("drawing module is init'ed.");  
    };

    fn.drawLine = function(x0, y0, x1, y1, config) {
        _setup(this, function(ctx) {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }, config);
    };
    
    fn.drawLines = function(points, config) {
        var p0 = points[0];
        var i, p;
        var count = points.length;
        _setup(this, function(ctx) {
            ctx.beginPath();
            ctx.moveTo(p0[0], p0[1]);
            for (i = 1; i < count; i++) {
                p = points[i];
                ctx.lineTo(p[0], p[1]);
            }
            ctx.stroke();
        }, config);
    };

    fn.drawPolygon = function(centerX, centerY, radius, sides, config) {
        config = config || {};

        var deg = Math.PI * 2 / sides;

        _setup(this, function(ctx) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - radius);

            var i, d, x, y;

            for ( i = 1; i < sides; i++ ) {
                d = i * deg - Math.PI / 2;
                x = centerX + Math.cos(d) * radius;
                y = centerY + Math.sin(d) * radius;
                ctx.lineTo(x, y);  
            }

            ctx.closePath();
            ctx.fill();
            ctx.stroke();

        }, config);
    };

    fn.drawRectangle = function(x, y, width, height, config) {
        config = config || {};

        _setup(this, function(ctx) {
            if (config.anchor === "center") {
                x -= width / 2;
                y -= height / 2; 
            }
            var rotation = config.rotation;
            if (rotation) {
                x = x + width / 2;
                y = y + height / 2;
                ctx.translate(x, y);
                ctx.rotate(rotation);
                x = - width / 2;
                y = - height / 2;
            } else {
                ctx.translate(x, y);
                x = 0;
                y = 0;
            }

            var cr = config.cornerRadius;

            ctx.beginPath();
            if ( cr ) {
                ctx.moveTo(x + cr, y);
                ctx.lineTo(x + width - cr, y);
                ctx.arcTo(x + width, y, x + width, y + cr, cr);
                ctx.lineTo(x + width, y + height - cr);
                ctx.arcTo(x + width, y + height, x + width - cr, y + height, cr);
                ctx.lineTo(x + cr, y + height);
                ctx.arcTo(x, y + height, x, y + height - cr, cr);
                ctx.lineTo(x, y + cr);
                ctx.arcTo(x, y, x + cr, y, cr);
            } else {
                ctx.rect(x, y, width, height);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
        }, config);
    };

    fn.drawEllipse = function(x, y, width, height, config) {
        _setup(this, function(ctx) {
            var w = width;
            var h = height;
            var kappa = 0.5522848;
            var ox = (w / 2) * kappa; // control point offset horizontal
            var oy = (h / 2) * kappa; // control point offset vertical
            var xe = x + w;           // x-end
            var ye = y + h;           // y-end
            var xm = x + w / 2;       // x-middle
            var ym = y + h / 2;       // y-middle

            ctx.beginPath();
            ctx.moveTo(x, ym);
            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }, config);
    };

    fn.drawArc = function(centerX, centerY, radius, startingAngle, endingAngle, counterClockwise, config) {
        _setup(this, function(ctx) {
            var x = centerX + radius * Math.cos(startingAngle);
            var y = centerY + radius * Math.sin(startingAngle);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(centerX, centerY, radius, startingAngle, endingAngle, counterClockwise);
            ctx.fill();
            ctx.stroke();
        }, config); 
    };

    fn.drawCircle = function(centerX, centerY, radius, config) {
        this.drawArc(centerX, centerY, radius, 0, Math.PI * 2, false, config);
    };

    fn.drawText = function(x, y, text, config) {
        _setup(this, function(ctx) {
            ctx.fillText(text, x, y);
        }, config);
    };

    // == Private Methods ==

    function _setup (oc, draw, config) {
        var ctx = oc.getContext();
        ctx.save();
        config = config || {};
        _stylize(oc, config);
        draw(ctx);
        ctx.restore();
    }

    function _stylize (oc, config) {
        var mergedConfig = OC.Util.merge(oc.getGlobalConfig(), config);
        var ctx = oc.getContext();
        oc.updateConfig(ctx, mergedConfig);
        //OC.Util.merge(ctx, mergedConfig, true, _EXCLUDES);
    }

    debug.info("drawing module is installed.");
};
