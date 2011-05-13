//= require "oc.core"
//= require "oc.util"

(function (OC) {

    var _EXCLUDES = ['rotate', 'translate', 'scale', 'transform'];

    var _config = {
        'textBaseline':  'top',
        'font':          '14px sans-serif'
    };

    // ## init ##

    OC.initialize(function(oc) {
        var gConfig = oc.getGlobalConfig();
        OC.Util.sync(_config, gConfig);

        debug.info("drawing module is init'ed.");  
    });

    // ++ Augment OOPCanvas ++
    
    /**
     * update configuration
     */
    OC.prototype.updateConfig = function (config, updates) {
        OC.Util.merge(config, updates, true, _EXCLUDES);
    };

    // stops: array, stop[0]: position, stop[1]: color
    OC.prototype.createLinearGradient = function (x0, y0, x1, y1, stops) {
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

    OC.prototype.drawLine = function(x0, y0, x1, y1, config) {
        _setup(this, function(ctx) {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }, config);
    };
    
    OC.prototype.drawLines = function(points, config) {
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

    OC.prototype.drawPolygon = function(centerX, centerY, radius, sides, config) {
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

    OC.prototype.drawRectangle = function(x, y, width, height, config) {
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

    OC.prototype.drawEllipse = function(x, y, width, height, config) {
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

    OC.prototype.drawArc = function(centerX, centerY, radius, startingAngle, endingAngle, counterClockwise, config) {
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

    OC.prototype.drawCircle = function(centerX, centerY, radius, config) {
        this.drawArc(centerX, centerY, radius, 0, Math.PI * 2, false, config);
    };

    OC.prototype.drawPath = function _drawPath (x, y, pathData, config) {
        // cache parser
        if ( !_drawPath._parser ) {
            _drawPath._parser = new PathHandler();
        }

        _setup(this, function(ctx) {
            var routine = _drawPath._parser.parse(pathData);
            with(ctx) {
                translate(x, y);
                beginPath();
                eval(routine);
                fill();
                stroke();
            }
        }, config);
    };

    OC.prototype.drawImage = function(x, y) {
        var ctx = this.getContext();
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage.apply(ctx, arguments);
        ctx.restore();
    };

    OC.prototype.drawText = function(x, y, text, config) {
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
    }

    // =================
    // == PathHandler ==
    // =================
    
    // It DOES NOT yet support relative points.
    // Therefore all the rel methods haven't been tested, event though they
    // have been written.
    // TODO: evaluate if it needs to

    /**
     * @name PathHandler
     * @class
     * @requires Path Parser
     */
    function PathHandler (context) {
        this._ctx = context;
        this._parser = new PathParser();
        this._parser.setHandler(this);

        this._pathData = null;
        this._routine = null;
        this._lastPoint = null;
        this._lastControlPoint = null;
        // cache the parsed result
        this._routines = {};
    }

    PathHandler.prototype.parse = function(data) {
        if ( !( data in this._routines ) ) {
            this._pathData = data;
            this._routine = [];
            this._parser.parseData(data);
            this._routines[data] = this._routine.join("");
        }
        
        return this._routines[data] ;
    };

    PathHandler.prototype.addRoutine = function(name, params) {
        var result = [];
        var args = [];

        for (var i = 0; i < params.length; i++ ) {
            args[i] = params[i];
        }

        result.push(name);
        result.push("(");
        result.push(args.join(","));
        result.push(")");
        
        this._routine.push(result.join("") + ";");
    };

    PathHandler.prototype.movetoAbs = function(x, y) {
        this.addRoutine("moveTo", arguments);
        this._lastPoint = [x, y];
    };

    PathHandler.prototype.movetoRel = function(x, y) {
        this.movetoAbs.apply(this, arguments);
    };

    // -- Line --

    PathHandler.prototype.linetoAbs = function(x, y) {
        this.addRoutine("lineTo", arguments);
        this._lastPoint = [x, y];
    };

    PathHandler.prototype.linetoRel = function(x, y) {
        this.linetoAbs.apply(this, arguments);
    };

    PathHandler.prototype.linetoHorizontalAbs = function(x) {
        var args = [ x, this._lastPoint[1] ];
        this.linetoAbs.apply(this, args);
    };

    PathHandler.prototype.linetoHorizontalRel = function(x) {
        this.linetoHorizontalAbs.apply(this, arguments);
    };

    PathHandler.prototype.linetoVerticalAbs = function(y) {
        var args = [ this._lastPoint[0], y ];
        this.linetoAbs.apply(this, args);
    };

    PathHandler.prototype.linetoVerticalRel = function(y) {
        this.linetoVerticalAbs.apply(this, arguments);
    };

    // -- Cubic Curve --

    PathHandler.prototype.curvetoCubicAbs = function(x1, y1, x2, y2, x, y) {
        this.addRoutine("bezierCurveTo", arguments);
        this._lastPoint = [x, y];
        this._lastControlPoint = [x2, y2];
    };

    PathHandler.prototype.curvetoCubicRel = function(x1, y1, x2, y2, x, y) {
        this.curvetoCubicAbs.apply(this, arguments);
    };

    PathHandler.prototype.curvetoCubicSmoothAbs = function(x2, y2, x, y) {
        var args = Array.prototype.concat.apply(_getReflectionPoint(this._lastControlPoint, this._lastPoint), arguments);
        this.curvetoCubicAbs.apply(this, args);
    };

    PathHandler.prototype.curvetoCubicSmoothRel = function(x2, y2, x, y) {
        this.curvetoCubicSmoothAbs.apply(this, arguments);
    };

    // -- Quadratic Curve --

    PathHandler.prototype.curvetoQuadraticAbs = function(x1, y1, x, y) {
        this.addRoutine("quadraticCurveTo", arguments);
        this._lastPoint = [x, y];
        this._lastControlPoint = [x1, y1];
    };

    PathHandler.prototype.curvetoQuadraticRel = function(x1, y1, x, y) {
        this.curvetoQuadraticAbs.apply(this, arguments);
    };

    PathHandler.prototype.curvetoQuadraticSmoothAbs = function(x, y) {
        var args = Array.prototype.concat.apply(_getReflectionPoint(this._lastControlPoint, this._lastPoint), arguments);
        this.curvetoQuadraticAbs.apply(this, args);
    };

    PathHandler.prototype.curvetoQuadraticSmoothRel = function(x, y) {
        this.curvetoQuadraticSmoothAbs.apply(this, arguments);
    };

    // -- Elliptical Arc --

    PathHandler.prototype.arcAbs = function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
        throw "not supported yet";
    };

    PathHandler.prototype.arcRel = function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
        this.arcAbs.apply(this, arguments);
    };

    // -- Close Path --

    PathHandler.prototype.closePath = function() {
        this.addRoutine("closePath", arguments);
    };

    function _getReflectionPoint (point, origin) {
        var refX = origin[0] - point[0] + origin[0];
        var refY = origin[1] - point[1] + origin[1];
        return [ refX, refY ];
    }

    debug.info("drawing module is installed.");

})(OOPCanvas);
