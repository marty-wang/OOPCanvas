/*
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */
window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})();

var OOPCanvas = (function(undefined) {

    debug.setLevel(3);

    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'https://github.com/marty-wang/OOPCanvas',
        'license': 'MIT'
    };


    function OOPCanvas (canvas, globalConfig) {
        if (!canvas) {
            throw "Canvas cannot be null or undefined";
        }

        this._ctx = canvas.getContext('2d');
        if (!this._ctx) {
            throw "The passed-in canvas argument is not valid";
        }

        this._width = canvas.getAttribute('width');
        this._height = canvas.getAttribute('height');

        this._children = {};

        this._globalConfig = globalConfig || {};

        _initModules(this);
    }


    OOPCanvas.prototype.getWidth = function() {
        return this._width;
    };

    OOPCanvas.prototype.getHeight = function() {
        return this._height;
    };

    OOPCanvas.prototype.getContext = function() {
        return this._ctx;
    };

    OOPCanvas.prototype.getGlobalConfig = function() {
        return this._globalConfig;
    };



    OOPCanvas.childIdCounter = -1;

    OOPCanvas.prototype._addChild = function(child) {
        var id = child.getId();
        var children = this._children;
        if ( ~~children[id] ) {
            return;
        }

        children[id] = child;
    };


    OOPCanvas.modules = {};

    OOPCanvas.installModules = function (moduleSettings) {
        moduleSettings = moduleSettings || {};
        _iterateModules(function(m, mk) {
            m(OOPCanvas, moduleSettings[mk]);
        });
    };


    function _initModules (oc) {
        _iterateModules(function(m) {
            if (m.init) {
                m.init(oc);
            }
        });
    }

    function _iterateModules (callback) {
        var mk, module;
        var modules = OOPCanvas.modules;

        for (mk in modules) {
            if (Object.prototype.hasOwnProperty.call(modules, mk)) {
                module = modules[mk];
                callback(module, mk);
            }
        }
    }

    return OOPCanvas;

})();

'OC' in window || (window.OC = OOPCanvas);

window.OOPCanvas.modules.util = function(OOPCanvas) {

    (function() {

        this.Util = this.Util || {};
        this.Array = this.Array || {};


        this.Util.hasOwnProperty = function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };

        this.Util.merge = function _merge (merging, merged/*, mutable, excludes*/) {
            var arg2 = arguments[2];
            var arg3 = arguments[3];

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
                if (OC.Util.hasOwnProperty(merged, prop)) {
                    orig[prop] = merged[prop];
                }
            }

            return orig;
        };

        this.Util.sync = function (obj1, obj2) {
            var k;
            for ( k in obj1 ) {
                if (OOPCanvas.Util.hasOwnProperty(obj1, k)) {
                    if (obj2[k]) {
                        obj1[k] = obj2[k];
                    } else {
                        obj2[k] = obj1[k];
                    }
                }
            }
        };


        this.Array.indexOf = function(array, obj) {
            var idx = -1;
            if (array.indexOf) {
                idx = array.indexOf(obj);
            } else {
                var i, count;
                for (i = 0, count = array.length; i < count; i++) {
                    var o = array[i];
                    if ( o === obj ) {
                        idx = i;
                        break;
                    }
                }
            }

            return idx;
        };

        this.Array.remove = function(array, from, to) {
            var rest = array.slice((to || from) + 1 || array.length);
            array.length = from < 0 ? array.length + from : from;
            return array.push.apply(array, rest);
        };

        this.Array.removeObject = function(array, obj) {
            var idx = Array.indexOf(array, obj);
            if (idx < 0) {
                return;
            }

            Array.remove(idx);
        };

    }).call(OOPCanvas);

    debug.info("util module is installed.");
};

window.OOPCanvas.modules.drawing = function(OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OOPCanvas.prototype;

    var _EXCLUDES = ['rotate', 'translate', 'scale', 'transform'];

    fn.drawLine = function(x0, y0, x1, y1, config) {
        _setup(this, function(ctx) {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }, config);
    };

    fn.drawRect = function(x, y, width, height, config) {
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

    fn.clear = function(x, y, width, height) {
        var ctx = this.getContext();
        ctx.clearRect(x, y, width, height);
    };

    fn.clearAll = function() {
        this.clear(0, 0, this.getWidth(), this.getHeight());
    };


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
        OC.Util.merge(ctx, mergedConfig, true, _EXCLUDES);
    }

    debug.info("drawing module is installed.");
};

window.OOPCanvas.modules.runloop = function _runloop (OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    var DEFAULT_FPS = 60;

    var _config = {
        'fps': DEFAULT_FPS,
        'useOptimizedRunloop': false // overwrite fps to 0
    };

    var _requestFrameFunc = null;

    var _shouldRun = null;
    var _isLooping = null;

    var _lastFrame = null;
    var _curFPS = null;

    var _postHooks = [];

    _runloop.init = function(oc) {
        var gConfig = oc.getGlobalConfig();
        OC.Util.sync(_config, gConfig);
        if (_config.useOptimizedRunloop) {
            _config.fps = 0;
        }
        _requestFrameFunc = _requestLoopFrame(_config.fps);

        debug.info("runloop module is init'ed.");
    };

    fn.isLooping = function() {
        return _isLooping;
    };

    fn.getCurrentFPS = function() {
        return _curFPS;
    };

    fn.installPostHook = function(hook) {
        _postHooks.push(hook);
    };

    fn.removePostHook = function(hook) {
    };

    fn.startRunloop = function() {
        if (_isLooping) {
            return;
        }

        _shouldRun = true;
        _loop(this);
    };

    fn.stopRunloop = function() {
        if (_isLooping) {
            _shouldRun = false;
        }
    };

    function _loop (oc) {

        (function run() {
            _framing(oc);

            if (_shouldRun) {
                 _requestFrameFunc(run);
                _isLooping = true;
            } else {
                _isLooping = false;
            }
        })();

    }

    function _requestLoopFrame (fps) {

        var frameFunc = null;

        var st = window.setTimeout;

        var reqAnimFrame =  window.requestAnimationFrame       ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame    ||
                            window.oRequestAnimationFrame      ||
                            window.msRequestAnimationFrame     ||
                            st;

        var func;

        if (~~fps) {
            func = st;
        } else {
            func = reqAnimFrame;
            fps = DEFAULT_FPS;
        }

        if (func === st) {
            frameFunc = function(callback) {
                 func(callback, 1000 / fps);
            };
        } else {
            frameFunc = function(callback) {
                func(callback);
            };
        }

        return frameFunc;
    }

    function _framing (oc) {
        _running(oc);
        _callPostHooks(oc);
        _calcCurFrame();
    }

    function _callPostHooks (oc) {
        var i;
        var count = _postHooks.length;

        for (i = 0; i < count; i++) {
            var hook = _postHooks[i];
            hook(oc);
        }
    }

    function _running (oc) {
        _clear(oc);
        _update(oc);
        _render(oc);
    }

    function _clear (oc) {
        var ctx = oc.getContext();
        var w = oc.getWidth();
        var h = oc.getHeight();

        ctx.clearRect(0, 0, w, h);
    }

    function _update (oc) {

    }

    function _render (oc) {
    }

    function _calcCurFrame () {
        var dt, fps;
        var curFrame = new Date().getTime();
        dt = curFrame - _lastFrame;
        if (~~dt) {
            _curFPS = ~~(1000 / dt);
        }
        _lastFrame = curFrame;
    }

    debug.info("runloop module is installed.");
};

window.OOPCanvas.modules.debug = function(OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    fn.enableDebugMode = function() {
        this.installPostHook(_printDebugInfo);
    };

    function _printDebugInfo (oc) {
        _printFPS(oc);
    }

    function _printFPS (oc) {
        var fps = oc.getCurrentFPS();
        var fps_info = "" + fps;
        var color = "green";
        if (fps < 30) {
            color = "red";
        }
        oc.drawText(0, 0, fps_info, {
            'fillStyle': color
        });
    }

    debug.info("debug module is installed.");

};

window.OOPCanvas.modules.ui = function(OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    fn.createRect = function(x, y, width, height, config) {

        var oc = this;

        function Rect (x, y, width, height, config) {
            this._id = "Rect-" + (++OC.childIdCounter);

            this._render.apply(this, arguments);
            oc._addChild(this);
        }

        Rect.prototype.getId = function() {
            return this._id;
        };

        Rect.prototype._render = function(x, y, width, height, config) {
            oc.drawRect.apply(oc, arguments);
        };

        return new Rect(x, y, width, height, config);
    };

    debug.info("ui module is installed.");
};
