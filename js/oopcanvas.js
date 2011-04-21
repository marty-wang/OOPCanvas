(function(undefined) {
    
    if (this.OC) {
        return;
    }
    
    // TODO: add more
    var _EXCLUDES = ['rotate', 'translate', 'scale', 'transform'];

    this.OC = function(canvas, globalConfig) {
        if (!canvas) {
            throw "Canvas cannot be null or undefined";
        }

        this._ctx = canvas.getContext('2d');
        if (!this._ctx) {
            throw "The passed-in canvas argument is not valid";
        }

        this._globalConfig = globalConfig || {};
    };

    var OC = this.OC;

    OC.prototype.drawLine = function(x0, y0, x1, y1, config) {
        _setup(this, function(ctx) {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();         
        }, config);
    };

    OC.prototype.drawRect = function(x, y, width, height, config) {
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
              
            ctx.beginPath();
            ctx.rect(x, y, width, height);
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

    function _setup (oc, draw, config) {
        var ctx = oc._ctx;
        ctx.save();
        _stylize(oc, config);
        draw(ctx);
        ctx.restore();
    }

    function _stylize (oc, config) {
        config = config || {};
        
        var mergedConfig = OC.merge(oc._globalConfig, config);
        var ctx = oc._ctx;
        
        OC.merge(ctx, mergedConfig, true, _EXCLUDES);
    }

    // ===================
    // == Static Method ==
    // ===================

    // mutable: wether it will chage the merging object or not
    // excludes: the array containing the names of properties that should not be
    // merged
    OC.merge = function _merge (merging, merged/*, mutable, excludes*/) {
        var arg2 = arguments[2];
        var arg3 = arguments[3];

        // default values
        var mutable = false;
        var excludes = [];

        if (typeof arg2 === "boolean") {
            mutable = arg2;
            if (typeof arg3 === "object") {
                excludes = arg3;
            }
        } else if (typeof arg2 === "object") {
            excludes = arg2;
        }

        var orig = {};
        if (!mutable) {
            orig = _merge(orig, merging, true);
        } else {
            orig = merging;
        }

        var prop;

        for (prop in merged) {
            if ( excludes.indexOf(prop) > -1 ) {
                continue;
            }
            if (Object.prototype.hasOwnProperty.call(merged, prop)) {
                orig[prop] = merged[prop];
            }
        }

        return orig;
    };

}).call(window);
