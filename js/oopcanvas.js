(function(undefined) {
    
    if (this.OC) {
        return;
    }
    
    // TODO: add more
    var _EXCLUDES = ['rotate', 'translate'];

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
              ctx.fillRect(x, y, width, height);
            
        }, config);
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
        
        var mergedConfig = OC.merge(oc._globalConfig, config, false);
        var ctx = oc._ctx;
        
        OC.merge(ctx, mergedConfig, true, _EXCLUDES);
    }

    // ===================
    // == Static Method ==
    // ===================

    // TODO: refine the arguments logic
    OC.merge = function _merge (merging, merged, mutable, excludes) {

        excludes = excludes || [];

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
    }

}).call(window);
