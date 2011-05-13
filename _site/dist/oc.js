/*!
 * OOPCanvas JavaScript Library
 * http://marty_wang.no.de/
 * Licensed under the MIT license.
 *
 * Copyright (C) 2011 by Mo Wang
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Dependencies: <a href="http://benalman.com/projects/javascript-debug-console-log/">JavaScript Debug</a>, <a href="http://www.broofa.com/2008/09/javascript-uuid-function/">Math.uuid.js</a>, <a href="http://www.kevlindev.com/dom/path_parser/index.htm">Path Parser</a>
 * @class
 * @exports OC as OOPCanvas
 */
var OOPCanvas = (function() {

    debug.setLevel(0);

    /**
     * @static
     */
    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'git@github.com:marty-wang/OOPCanvas.git',
        'license': 'MIT'
    };

    /**
     * @private
     * @constructor
     */
    function OOPCanvas () {}


    /**
     * @private
     */
    OOPCanvas._inits = [];

    /**
     * @static
     */
    OOPCanvas.installPlugin = function(namespace, creator) {
        var fn = OOPCanvas.prototype;

        fn[namespace] = function() {
            if (!!creator) {
                return creator.apply(this, arguments);
            }
        };
    };

    /**
     * @static
     */
    OOPCanvas.initialize = function(init) {
        OOPCanvas._inits.push(init);
    };


    OOPCanvas.prototype._initModules = function() {
        debug.info("+++ Start to Init Modules +++");
        var oc = this;
        var i, init;
        var inits = OOPCanvas._inits;
        var count = inits.length;

        for (i = 0; i < count; i++) {
            init = inits[i];
            init(oc);
        }
        debug.info("+++ Completed Modules Init +++");
    };

    return OOPCanvas;

})();

'OC' in window || (window.OC = OOPCanvas);


(function(OC) {

    /**
     * @namespace
     */
    OC.Util = {};

    /**
     * @exports Util as OOPCanvas.Util
     */
    var Util = OC.Util;

    /**
     * @static
     */
    Util.hasOwnProperty = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    /**
     * @static
     */
    OC.Util.iterateProperties = function(props, callback) {
        var prop;
        var util = this;
        for ( prop in props) {
            if ( util.hasOwnProperty(props, prop) ) {
                callback(prop, props[prop]);
            }
        }
    };


    /**
     * @param {Object} merging the object is merging
     * @param {Object} merged the object is being merged
     * @param {Boolean} [mutable="false"] wether or not the merging object will be
     * mutated
     * @param {Array} [excludes="[]"] the array containing the names of properties that should not be
     * merged
     * @returns the object of merging result
     */
    OC.Util.merge = function _merge (merging, merged/*, mutable, excludes*/) {
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

    /**
     * sync two objects to have the same values of obj1's properties obj2's value weighs higher
     */
    OC.Util.sync = function (obj1, obj2) {
        var k;
        for ( k in obj1 ) {
            if (OOPCanvas.Util.hasOwnProperty(obj1, k)) {
                if ( k in obj2 ) {
                    obj1[k] = obj2[k];
                } else {
                    obj2[k] = obj1[k];
                }
            }
        }
    };

    /**
     * generate the rand number
     * @requires Math.uuid.js
     */
    OC.Util.rand = function(seed) {
        seed = seed || 10;
        return Math.uuid(seed);
    };

    /**
     * Helper function that implements (pseudo)Classical inheritance inheritance.
     * @see http://www.yuiblog.com/blog/2010/01/06/inheritance-patterns-in-yui-3/
     * @param {Function} childClass
     * @param {Function} parentClass
     */
    OC.Util.inherit = function (childClass, parentClass) {
        var tempClass = function() {
        };
        tempClass.prototype = parentClass.prototype;
        childClass.prototype = new tempClass();
        childClass.prototype.constructor = childClass;
        childClass.__super = function(obj, methodName) {
            var func = parentClass.prototype[methodName];
            if ( !!func ) {
                var args = Array.prototype.slice.call(arguments, 2);
                return func.apply(obj, args);
            }
        };
    };


    /**
     * @param {HTMLElement} element
     * @returns the absolute position of the dom element in the HTML document
     */
    OC.Util.domElementPosition = function (obj){
        var curleft = 0;
        var curtop = 0;
        if(obj.offsetParent) {
            while(1) {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                if(!obj.offsetParent) {
                    break;
                }
                obj = obj.offsetParent;
            }
        } else {
            if(obj.x) {
                curleft += obj.x;
            }

            if(obj.y) {
                curtop += obj.y;
            }
        }
        return {
            'left': curleft,
            'top': curtop
        };
    };


    /**
     * @param {Array} array
     * @prarm item
     * @returns the index of the item in the array
     */
    OC.Util.arrayIndexOf = function(array, obj) {
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

    /**
     * @see <a href="http://ejohn.org/blog/javascript-array-remove/">http://ejohn.org/blog/javascript-array-remove/</a>
     */
    OC.Util.arrayRemove = function(array, from, to) {
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    };

    /**
     * remove the item from the array
     * @param {Array} array
     * @param item
     */
    OC.Util.arrayRemoveObject = function(array, obj) {
        var idx = this.indexOf(array, obj);
        if (idx < 0) {
            return;
        }

        OC.Util.arrayRemove(array, idx);
    };

})(OOPCanvas);

debug.info("util module is installed.");

(function (OC, undefined) {


    OC.initialize(function(oc) {
        oc._runloop = new Runloop(oc);

        debug.info("runloop module is init'ed.");
    });

    /**
     * @constant
     */
    var DEFAULT_FPS = 60;


    /**
     * @function
     */
    OC.prototype.startRunloop = function() {
        this._runloop._startLoop();
    };

    /**
     * @function
     */
    OC.prototype.stopRunloop = function() {
        this._runloop._stopLoop();
    };

    /**
     * @function
     */
    OC.prototype.isLooping = function() {
        return this._runloop._isLooping;
    };

    /**
     * @function
     */
    OC.prototype.getCurrentFPS = function() {
        return this._runloop._curFPS;
    };

    /**
     * @function
     */
    OC.prototype.installHook = function(hook) {
        this._runloop._hooks.push(hook);
    };

    /**
     * @function
     */
    OC.prototype.removeHook = function(hook) {
    };

    /**
     * @function
     * @description stack-ish: first-in-last-out
     */
    OC.prototype.installPostHook = function(hook) {
        this._runloop._postHooks.unshift(hook);
    };

    /**
     * @function
     */
    OC.prototype.removePostHook = function(hook) {
    };


    /**
     * @name Runloop
     * @class Runloop allows other objects to install hooks on it, and
     * thereafter sends them ticks at the fps as configured.<br/>
     * This class is <b>NOT</b> exposed for public use, as it functions as
     * a singleton per OOPCanvas instance, and is managed by its OOPCanvas
     * instance. However, it adds functions to OOPCanvas, which in turn interacts with
     * other modules and public objects.
     * @description Here is the details about the Runloop class.
     */
    function Runloop(oc) {

        this._config = {
            'fps':                  DEFAULT_FPS, // if fps <= 0, only run 1st frame
            'useOptimizedRunloop':  false // overwrite fps to undefined
        };

        this._oc = oc;

        this._shouldRun = false;
        this._isLooping = false;

        this._lastFrame = null;
        this._curFPS = null;

        this._hooks = [];
        this._postHooks = []; // stack-ish: first-in-last-out

        this._requestFrameFunc = null;

        var gConfig = this._oc.getGlobalConfig();
        OC.Util.sync(this._config, gConfig);

        if (this._config.fps > 0) {
            if (this._config.useOptimizedRunloop) {
                this._config.fps = undefined;
                gConfig.fps = undefined;
            }
            this._requestFrameFunc = _requestLoopFrame(this._config.fps);
        }
    }


    Runloop.prototype._startLoop = function() {
        if (this._isLooping) {
            return;
        }

        if (!!this._requestFrameFunc) {
            this._shouldRun = true;
        }
        _loop(this);

    };

    Runloop.prototype._stopLoop = function() {
        if (this._isLooping) {
            this._shouldRun = false;
        }
    };


    function _loop (rl) {

        (function run() {
            _tick(rl);

            if (rl._shouldRun) {
                rl._requestFrameFunc(run);
                rl._isLooping = true;
            } else {
                rl._isLooping = false;
            }
        })();

    }

    function _tick (rl) {
        _calcCurFrame(rl);
        _callMainHooks(rl);
        _callPostHooks(rl);
    }

    function _callMainHooks (rl) {
        _callhooks(rl, rl._hooks);
    }

    function _callPostHooks (rl) {
        _callhooks(rl, rl._postHooks);
    }

    function _callhooks (rl, hooks) {
        var i, hook;
        var count = hooks.length;

        for (i = 0; i < count; i++) {
            hook = hooks[i];
            hook(rl._oc);
        }
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

        if ( fps > 0 ) {
            func = st;
        } else if ( fps === undefined ) {
            func = reqAnimFrame;
            fps = DEFAULT_FPS;
        }

        if (func === st) {
            frameFunc = function(callback) {
                 func(callback, 1000 / fps);
            };
        } else if ( func !== undefined ) {
            frameFunc = function(callback) {
                func(callback);
            };
        }

        return frameFunc;
    }

    function _calcCurFrame (rl) {
        var dt, fps;
        var curFrame = new Date().getTime();
        dt = curFrame - rl._lastFrame;
        if (~~dt) {
            rl._curFPS = Math.ceil(1000 / dt);
        }
        rl._lastFrame = curFrame;
    }


    debug.info("runloop module is installed.");

})(OOPCanvas);

(function (OC) {


    OC.initialize( function(oc) {
        oc.installPostHook(function(oc) {
            _render(oc);
        });

        debug.info("core module is init'ed.");
    } );


    /**
     * Should always use this method to create OOPCanvas instance.
     * @returns the OOPCanvas instance
     */
    OC.create = function(canvas, globalConfig) {
        var oc = new OC();
        oc._core = new Core(canvas, globalConfig);
        oc._initModules();

        return oc;
    };

    /**
     * @function
     */
    OC.prototype.changeCursor = function(cursor) {
        this._core._canvas.style.cursor = cursor;
    };

    /**
     * get the absoulte position of the canvas in the HTML document
     * @returns object that has properties of left and top
     */
    OC.prototype.getPosition = function() {
        return this._core._position;
    };

    /**
     * get the canvas size
     * @returns object that has propertis of width and height
     */
    OC.prototype.getSize = function() {
        return {
            'width': this._core._width,
            'height': this._core._height
        };
    };

    /**
     * @returns the HTML canvas element
     */
    OC.prototype.getCanvas = function () {
        return this._core._canvas;
    };

    /**
     * returns the rendering context. Depending on the configuration it can
     * return the regular context or the backbuffer context.
     */
    OC.prototype.getContext = function() {
        var core = this._core;
        return core.useBackBuffer() ? core._backBufferCtx : core._ctx;
    };

    /**
     * clear the specific area
     */
    OC.prototype.clear = function(x, y, width, height) {
        var core = this._core;
        core._ctx.clearRect(x, y, width, height);
        if (!!core._backBufferCtx) {
            core._backBufferCtx.clearRect(x, y, width, height);
        }
    };

    /**
     * clear the entrie canvas
     */
    OC.prototype.clearAll = function() {
        var size = this.getSize();
        this.clear(0, 0, size.width, size.height);
    };

    /**
     * return the global configuration
     */
    OC.prototype.getGlobalConfig = function() {
        return this._core._globalConfig;
    };


    function _render (oc) {
        var core = oc._core;
        if (core.useBackBuffer()) {
            core._ctx.drawImage(core._backBuffer, 0, 0);
        }
    }

    /**
     * @name Core
     * @class Core is the rendering engine.<br/>
     * Configuration: <b>useBackBuffer</b>(default: false) <br/><br/>
     * <i>This class is <b>NOT</b> exposed for public use, as it functions as
     * a singleton per OOPCanvas instance, and is managed by its OOPCanvas
     * instance. However, it adds functions to OOPCanvas, which in turn interacts with
     * other modules and public objects.</i>
     */

    function Core (canvas, globalConfig) {
        if (!canvas) {
            throw "Canvas cannot be null or undefined";
        }

        this._ctx = canvas.getContext('2d');
        if (!this._ctx) {
            throw "The passed-in canvas argument is not valid";
        }

        this._canvas = canvas;

        this._backBuffer = null;
        this._backBufferCtx = null;

        this._position = OC.Util.domElementPosition(canvas);
        this._width = canvas.getAttribute('width');
        this._height = canvas.getAttribute('height');

        this._config = {
            'useBackBuffer': false
        };

        this._globalConfig = globalConfig || {};
        OC.Util.sync(this._config, this._globalConfig);

        if (this._config.useBackBuffer) {
            _createBackBuffer(this);
        }
    }

    Core.prototype.useBackBuffer = function() {
        return this._config.useBackBuffer;
    };


    function _createBackBuffer (core) {
        var backBuffer = document.createElement('canvas');
        backBuffer.width = core._width;
        backBuffer.height = core._height;
        core._backBufferCtx = backBuffer.getContext('2d');
        core._backBuffer = backBuffer;
    }

    debug.info("core module is installed.");

})(OOPCanvas);

(function (OC) {


    OC.Animator = Animator;

    /**
     * shorthand method to create animator
     */
    OC.prototype.animator = function(obj) {
        return new Animator(obj);
    };


    var DEFAULT_ANIMATION_DURATION = 250; // in ms

    /**
     * @name Animator
     * @exports Animator as OOPCanvas.Animator
     * @class
     * @param {Object} object the object whose properties are animated by animator
     */
    function Animator (obj) {
        this._object = obj;

        this._bv = null;
        this._ev = null;
        this._cv = null;

        this._props = null;
        this._duration = null;
        this._easing = null;
        this._callbacks = null;

        this._startTime = null;
        this._deltaCurTime = null;
        this._endTime = null;
        this._isAnimating = false;
        this._curVals = null;
    }

    /**
     * @namespace The collection of easing equations.
     */
    Animator.easingFunctions = {};

    /**
     * @function
     */
    Animator.easingFunctions.linear = function (t, b, c, d) {
        return c*t/d + b;
    };

    /**
     * 3rd party and plugins should use this method to add easing functions.
     * the easing function should request the arguments of t, b, c, d
     */
    Animator.addEasingFunction = function(name, func) {
        var efs = Animator.easingFunctions;

        if ( name in efs) {
            throw '"' + name + '" easing function already exists!';
        }

        efs[name] = func;
    };


    /**
     * start animation
     */
    Animator.prototype.start = function(props, kwargs) {

        kwargs = kwargs || {};

        var duration = kwargs.duration;
        var easingFunc = kwargs.easingFunction;
        var callbacks = kwargs.callbacks;

        this._startTime = new Date().getTime();
        this._endTime = this._startTime + this._duration;
        this._duration = ~~duration <= 0 ? DEFAULT_ANIMATION_DURATION : duration;
        this._easingFunc = _getEasing(easingFunc);
        this._callbacks = callbacks || {};

        var obj = this._object;
        var varName;
        var bv, cv, ev; // cv === ev - bv

        var shouldAnimate = false;
        var animatedProps = {};

        OC.Util.iterateProperties(props, function(prop, value) {
            varName = _getVarName(obj, prop);
            if (!!varName) {
                bv = obj[varName];
                ev = value;
                cv = ev - bv;
                if (cv !== 0) {
                    animatedProps[prop] = [bv, cv];
                    if (!shouldAnimate) {
                        shouldAnimate = true;
                    }
                }
            }
        });

        if (!shouldAnimate) {
            return;
        }

        this._props = animatedProps;
        this._isAnimating = true;
        var start = this._callbacks.start;
        if (!!start) {
            start(props);
        }
    };

    /**
     * stop animation
     */
    Animator.prototype.stop = function() {

        if (!this._isAnimating) {
            return;
        }

        this._isAnimating = false;
        var complete = this._callbacks.complete;
        if (!!complete) {
            complete(this._curVals);
        }
    };

    /**
     * update animation
     */
    Animator.prototype.update = function(currentTime) {

        if (!this._isAnimating) {
            return false;
        }

        var animator = this;
        var obj = animator._object;
        var deltaCurTime = currentTime - animator._startTime;
        var props = animator._props;
        var duration = animator._duration;
        var varName;
        var curValue;
        var curVals = {};
        var easingFunc = animator._easingFunc;
        var animating = animator._callbacks.animating;

        OC.Util.iterateProperties(props, function(prop, value) {
            if (deltaCurTime >= duration) {
                curValue = value[0] + value[1];
            } else {
                curValue = easingFunc(deltaCurTime, value[0], value[1], duration);
            }
            varName = _getVarName(obj, prop);
            obj[varName] = curValue;
            curVals[prop] = curValue;
        });

        animator._curVals = curVals;

        if (deltaCurTime >= duration) {
            animator.stop();
        }

        if (animator._isAnimating && !!animating) {
            animating(curVals);
        }

        return true;
    };

    function _getVarName(obj, prop) {
        var varName;
        if (prop in obj) {
            varName = prop;
        } else if ( "_"+prop in obj ) {
            varName = "_" + prop;
        }
        return varName;
    }

    function _getEasing (easingFunc) {
        if (!easingFunc) {
            easingFunc = 'linear';
        }

        var func;
        if (typeof easingFunc === "string") {
            func = Animator.easingFunctions[easingFunc];
        } else {
            func = easingFunc;
        }

        if (!func) {
            func = Animator.easingFunctions.linear;
        }

        return func;
    }

    debug.info("animation module is installed.");

})(OOPCanvas);

(function (OC, undefined) {

    /**
     * @exports ef as OOPCanvas.Animator.easingFunctions
     */
    var ef = OC.Animator.easingFunctions;

    /**
     * Robert Penner's Easing Equations
     * t: current time, b: beginning value, d: duration
     * c: end value - beginning value
     * @see http://snippets.dzone.com/posts/show/4005
     */


    /**
     */
    ef.easeInQuad =  function (t, b, c, d) {
        t = t / d;
        return c*t*t + b;
    };

    /**
     */
    ef.easeOutQuad = function (t, b, c, d) {
        t = t / d;
        return -c*t*(t-2) + b;
    };

    /**
     */
    ef.easeInOutQuad = function (t, b, c, d) {
        t = t / (d/2);
        if ( t < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    };


    /**
     */
    ef.easeInCubic = function (t, b, c, d) {
        return c*(t/=d)*t*t + b;
    };

    /**
     */
    ef.easeOutCubic = function (t, b, c, d) {
        t = t / d - 1;
        return c*(t*t*t + 1) + b;
    };

    /**
     */
    ef.easeInOutCubic = function (t, b, c, d) {
        t = t / ( d / 2);
        if (t < 1) {
            return c/2*t*t*t + b;
        }
        t = t - 2;
        return c/2*(t*t*t + 2) + b;
    };


    /**
     */
    ef.easeInQuart = function (t, b, c, d) {
        t = t / d;
        return c*t*t*t*t + b;
    };

    /**
     */
    ef.easeOutQuart = function (t, b, c, d) {
        t = t / d - 1;
        return -c * (t*t*t*t - 1) + b;
    };

    /**
     */
    ef.easeInOutQuart = function (t, b, c, d) {
        t = t / ( d / 2 );
        if (t < 1) {
            return c/2*t*t*t*t + b;
        }
        t = t - 2;
        return -c/2 * (t*t*t*t - 2) + b;
    };


    /**
     */
    ef.easeInQuint = function (t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    };

    /**
     */
    ef.easeOutQuint = function (t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    };

    /**
     */
    ef.easeInOutQuint = function (t, b, c, d) {
        t = t / ( d / 2 );
        if (t < 1) {
            return c/2*t*t*t*t*t + b;
        }

        t = t - 2;
        return c/2*(t*t*t*t*t + 2) + b;
    };


    /**
     */
    ef.easeInSine = function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    };

    /**
     */
    ef.easeOutSine = function (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    };

    /**
     */
    ef.easeInOutSine = function (t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };


    /**
     */
    ef.easeInExpo = function (t, b, c, d) {
        return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    };

    /**
     */
    ef.easeOutExpo = function (t, b, c, d) {
        return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    };

    /**
     */
    ef.easeInOutExpo = function (t, b, c, d) {
        if (t===0) {
            return b;
        }
        if (t===d) {
            return b+c;
        }
        t = t / ( d / 2);
        if ( t < 1) {
            return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };


    /**
     */
    ef.easeInCirc = function (t, b, c, d) {
        t = t / d;
        return -c * (Math.sqrt(1 - t*t) - 1) + b;
    };

    /**
     */
    ef.easeOutCirc = function (t, b, c, d) {
        t = t / d - 1;
        return c * Math.sqrt(1 - t*t) + b;
    };

    /**
     */
    ef.easeInOutCirc = function (t, b, c, d) {
        t = t / ( d / 2);
        if ( t < 1 ) {
            return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        }
        t = t - 2;
        return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    };


    /**
     */
    ef.easeInElastic = function (t, b, c, d, a, p) {
        if ( t === 0 ) {
            return b;
        }

        t = t / d;
        if ( t === 1 ) {
            return b+c;
        }

        if ( p === undefined ) {
            p = d * 0.3;
        }

        var s;
        if ( ~~a < Math.abs( c ) ) {
            a = c;
            s= p / 4;
        } else {
            s = p / ( 2 * Math.PI ) * Math.asin( c / a );
        }

        t = t - 1;
        return -( a * Math.pow( 2, 10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
    };

    /**
     */
    ef.easeOutElastic = function (t, b, c, d, a, p) {
        if ( t === 0 ) {
            return b;
        }

        t = t / d;
        if ( t === 1 ) {
            return b+c;
        }

        if ( p === undefined ) {
            p = d * 0.3;
        }

        var s;
        if ( ~~a < Math.abs( c ) ) {
            a = c;
            s = p / 4;
        } else {
            s = p / ( 2 * Math.PI ) * Math.asin( c / a );
        }

        return a * Math.pow(2, -10 * t) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) + c + b;
    };

    /**
     */
    ef.easeInOutElastic = function (t, b, c, d, a, p) {
        if ( t === 0 ) {
            return b;
        }

        t = t / ( d / 2);
        if ( t === 2 ) {
            return b+c;
        }

        if ( p === undefined ) {
            p = d * ( 0.3 * 1.5 );
        }

        var s;
        if ( ~~a < Math.abs( c ) ) {
            a = c;
            s = p/4;
        } else {
            s = p / ( 2 * Math.PI ) * Math.asin( c / a );
        }

        if ( t < 1 ) {
            t = t - 1;
            return -0.5 * ( a * Math.pow(2, 10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
        }

        t = t - 1;
        return a * Math.pow( 2, -10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) * 0.5 + c + b;
    };


    /**
     */
    ef.easeInBack = function (t, b, c, d, s) {
        if ( s === undefined ) {
            s = 1.70158;
        }
        t = t / d;
        return c * t * t * ( ( s + 1 ) * t - s ) + b;
    };

    /**
     */
    ef.easeOutBack = function (t, b, c, d, s) {
        if ( s === undefined ) {
            s = 1.70158;
        }

        t = t / d - 1;
        return c * ( t * t * ( ( s + 1 ) * t + s ) + 1 ) + b;
    };

    /**
     */
    ef.easeInOutBack = function (t, b, c, d, s) {
        if ( s === undefined ) {
            s = 1.70158;
        }
        t = t / ( d / 2 );
        s = s * 1.525;
        if ( t < 1 ) {
            return c / 2 * ( t * t * ( ( s + 1 ) * t - s ) ) + b;
        }

        t = t - 2;
        return c / 2 * ( t * t * ( ( s + 1 ) * t + s ) + 2 ) + b;
    };


    /**
     * @function
     */
    ef.easeInBounce = _easeInBounce;

    /**
     * @function
     */
    ef.easeOutBounce = _easeOutBounce;

    /**
     */
    ef.easeInOutBounce = function (t, b, c, d) {
        if (t < d/2) {
            return _easeInBounce (t*2, 0, c, d) * 0.5 + b;
        }
        return _easeOutBounce (t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    };


    function _easeInBounce (t, b, c, d) {
	    return c - _easeOutBounce (d-t, 0, c, d) + b;
    }

    function _easeOutBounce (t, b, c, d) {
        t = t / d;
        if (t < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            t = t - (1.5/2.75);
            return c*(7.5625*t*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            t = t - (2.25/2.75);
            return c*(7.5625*t*t + 0.9375) + b;
        } else {
            t = t - (2.625/2.75);
            return c*(7.5625*t*t + 0.984375) + b;
        }
    }

    debug.info("easing module is installed.");

})(OOPCanvas);

(function(OC) {

    /**
     * @namespace
     */
    OC.Collections = {};

    /**
     * @class Sortable Dictionary structure
     */
    OC.Collections.Dict = function Dict (sort) {
        this._dict = {};
        this._orders = [];
        this._sort = sort;
        if (!!this._sort) {
            var d = this;
            var s = d._sort;
            this._sortWrapper = function(k1, k2) {
                var v1 = d._dict[k1];
                var v2 = d._dict[k2];
                return s(v1, v2);
            };
        }
    };

    /**
     * @exports Dict as OOPCanvas.Collections.Dict
     */
    var Dict = OC.Collections.Dict;

    /**
     * return the value for the key.
     */
    Dict.prototype.getValue = function(key) {
        return this._dict[key];
    };

    /**
     * return if it is sorted dictionary.
     */
    Dict.prototype.isSorted = function() {
        return !!this._sort;
    };

    /**
     * return if it contains the key
     */
    Dict.prototype.contain = function (key) {
        return (key in this._dict);
    };

    /**
     * add the key-value pair to the dictionary
     */
    Dict.prototype.add = function(key, value) {
        if ( key in this._dict) {
            return;
        }

        this._dict[key] = value;
        if (!!this._sort) {
            this._orders.push(key);
            this._orders.sort(this._sortWrapper);
        }
    };

    /**
     * add an array of key-value pair to the dictionary
     * @param {Array[]} kvs each of the key-value pair is a 2-item array. kv[0]: key. kv[1]: value
     */
    Dict.prototype.addItems = function(kvs) {
        var i, kv, key, value;
        var count = kvs.length;

        for ( i = 0; i < count; i++ ) {
            kv = kvs[i];
            key = kv[0];
            value = kv[1];

            if ( key in this._dict ) {
                continue;
            }

            this._dict[key] = value;

            if (!!this._sort) {
                this._orders.push(key);
            }
        }

        if (!!this._sort) {
            this._orders.sort(this._sortWrapper);
        }
    };

    /**
     * remove a key-value pair from the dictionary
     */
    Dict.prototype.remove = function(key) {
        if ( key in this._dict ) {
            delete this._dict[key];
            if (!!this._sort) {
                OC.Util.arrayRemoveObject(this._orders, key);
                this._orders.sort(this._sortWrapper);
            }
        }
    };

    /**
     * remove an array of keys from the dictionary
     */
    Dict.prototype.removeItems = function(keys) {
        if ( typeof keys === "undefined" ) {
            this.removeAll();
        } else {
            var i, key;
            var count = keys.length;
            for ( i = 0; i < count; i++ ) {
                key = keys[i];
                if ( key in this._dict ) {
                    delete this._dict[key];
                    if (!!this._sort) {
                        OC.Util.arrayRemoveObject(this._orders, key);
                    }
                }
            }
            this._orders.sort(this._sortWrapper);
        }
    };

    /**
     * remove all key-value pairs from the dictionary
     */
    Dict.prototype.removeAll = function() {
        this._dict = {};
        this._orders.length = 0;
    };

    /** iterate the dictionary
     * @param {Function} callback The callback function will have the key and
     * value as the two arguments
     */
    Dict.prototype.iterate = function(callback) {
        var key, value;
        if (!!this._sort) {
            var i;
            var num = this._orders.length;
            for (i = 0; i < num; i++) {
                key = this._orders[i];
                value = this._dict[key];
                callback(key, value);
            }
        } else {
            for ( key in this._dict ) {
                if (OOPCanvas.Util.hasOwnProperty(this._dict, key)) {
                    value = this._dict[key];
                    callback(key, value);
                }
            }
        }
    };

})(OOPCanvas);

(function (OC) {

    var _EXCLUDES = ['rotate', 'translate', 'scale', 'transform'];

    var _config = {
        'textBaseline':  'top',
        'font':          '14px sans-serif'
    };


    OC.initialize(function(oc) {
        var gConfig = oc.getGlobalConfig();
        OC.Util.sync(_config, gConfig);

        debug.info("drawing module is init'ed.");
    });


    /**
     * update configuration
     */
    OC.prototype.updateConfig = function (config, updates) {
        OC.Util.merge(config, updates, true, _EXCLUDES);
    };

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


    PathHandler.prototype.arcAbs = function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
        throw "not supported yet";
    };

    PathHandler.prototype.arcRel = function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
        this.arcAbs.apply(this, arguments);
    };


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

(function (OC) {

    var _config = {
        'showDebugInfo': false
    };

    OC.initialize(function(oc) {
        var gConfig = oc.getGlobalConfig();
        OC.Util.sync(_config, gConfig);
        if(_config.showDebugInfo) {
            oc.installPostHook(_printDebugInfo);
        }

        debug.info("debug module is init'ed.");
    });

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

})(OOPCanvas);

(function (OC) {


    OC.EventEmitter = EventEmitter;

    /**
     * shorthand method to create Event Emitter instance.
     */
    OC.prototype.eventEmitter = function () {
        return new EventEmitter();
    };


    /**
     * Can be created by using shorthand method {@link OOPCanvas#eventEmitter}
     * @name EventEmitter
     * @exports EventEmitter as OOPCanvas.EventEmitter
     * @class The class deals with eventing.
     */
    function EventEmitter () {
        this._eventsMapper = {};
    }

    /**
    * @param { String } eventName
    * @param { Object|Function } subscriber Subscriber can be either object or
    * function. If it is an object, it must have an event handler function named
    * after "oneventName". For example, if the event is "created", the
    * corresponding event handler function should be named as "oncreated". If the
    * subscriber is a function, there is no naming striction.
    */
    EventEmitter.prototype.subscribe = function(eventName, subscriber) {
        if(typeof subscriber !== "object" && typeof subscriber !== "function") {
            throw "The subcriber needs to be either an object or a function";
        }

        var mapper = this._eventsMapper;
        if (!Object.prototype.hasOwnProperty.call(mapper, eventName)) {
            mapper[eventName] = [];
        }

        mapper[eventName].push(subscriber);
    };

    /**
     * @param {String} eventName
     * @param {Object|Function} [subscriber] if subscriber is left out, it will remove all the subscribers for that event.
     */
    EventEmitter.prototype.unsubscribe = function(eventName, subscriber) {
        var subscribers = this._eventsMapper[eventName];

        if (subscribers === undefined) {
            return;
        }

        if (subscriber === undefined) {
            subscribers.length = 0;
        } else {
            var index = OC.Util.arrayIndexOf(subscribers, subscriber);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        }

        if(subscribers.length === 0) {
            delete this._eventsMapper[eventName];
        }
    };

    /**
     * trigger event
     */
    EventEmitter.prototype.fire = function(sender, eventName, eventArgs) {
        var subscribers = this._eventsMapper[eventName];

        if(subscribers === undefined) {
            return;
        }

        var num = subscribers.length;
        var i;
        var subscriber;
        var method;

        for (i = 0; i < num; i++) {
            subscriber = subscribers[i];
            if (typeof subscriber === "function") {
                subscriber.call(null, sender, eventArgs);
            } else if (typeof subscriber === "object") {
                method = "on" + eventName;
                subscriber[method].call(subscriber, sender, eventArgs);
            }
        }
    };

    debug.info("eventEmitter module is installed.");

})(OOPCanvas);


(function (OC) {


    OC.initialize( function (oc) {
        oc._interaction = new Interaction(oc);

        debug.info("interaction module is init'ed.");
    });


    var fn = OC.prototype;

    fn._dequeueEvent = function () {
        return this._interaction.dequeueEvent();
    };

    fn._hitTest = function(element, x, y) {
        return this._interaction.hitTest(element, x, y);
    };

    fn._getHitTestContext = function() {
        return this._interaction.getHitTestContext();
    };



    /**
     * @name Interaction
     * @class This class handles the interaction with users. <br/><br/>
     * <i>This class is <b>NOT</b> exposed for public use, as it functions as
     * a singleton per OOPCanvas instance, and is managed by its OOPCanvas
     * instance. However, it adds functions to OOPCanvas, which in turn interacts with
     * other 1st-party modules.</i>
     */

    function Interaction (oc) {
        this._oc = oc;
        this._canvas = oc.getCanvas();
        this._refPoint = oc.getPosition();

        this._hitTestCtx = null;

        this._events = []; // queue-ish, first-in-first-out

        _createHitTestContext(this);
        _registerEventHandlers(this);
    }

    Interaction.prototype.getHitTestContext = function() {
        return this._hitTestCtx;
    };

    Interaction.prototype.hitTest = function(element, x, y) {
        var ctx = this._hitTestCtx;
        var result = null;
        if ( ctx.isPointInPath(x, y) ) {
            result = {
                'element': element,
                'point': [x, y]
            };
        }
        return result;
    };

    Interaction.prototype.dequeueEvent = function() {
        return _dequeueEvent(this);
    };

    function _createHitTestContext (ia) {
        var oc = ia._oc;
        var buffer = document.createElement('canvas');
        var size = oc.getSize();
        buffer.width = size.width;
        buffer.height = size.height;
        ia._hitTestCtx = buffer.getContext('2d');
    }

    var events = ["click", "mousemove", "mousedown", "mouseup"];

    function _registerEventHandlers (ia) {
        var canvas = ia._canvas;


        for ( var i = 0, count = events.length ; i < count; i++ ) {
            _bind(canvas, events[i], function(evt){
                _enqueueEvent(ia, evt);
            });
        }
    }


    function _onmousemove (ia, evt) {
        debug.debug("interaction: on mouse move");
        _enqueueEvent(ia, evt);
    }

    function _onclick (ia, evt) {
        debug.debug("interaction: on click");
        _enqueueEvent(ia, evt);
    }


    function _bind (canvas, eventName, handler) {
        canvas.addEventListener(eventName, handler, false);
    }

    function _enqueueEvent (ia, event) {
        event = !event ? window.event : event;
        var relPoint = _getRelativePoint(event, ia._refPoint);
        var evt = {
            'type': event.type,
            'left': relPoint[0],
            'top': relPoint[1]
        };
        ia._events.push(evt);
    }

    function _dequeueEvent (ia) {
        return ia._events.shift();
    }

    function _getRelativePoint(e, refPoint) {
	    var posx = 0;
	    var posy = 0;
	    if (e.pageX || e.pageY) {
		    posx = e.pageX;
		    posy = e.pageY;
	    } else if (e.clientX || e.clientY) {
		    posx = e.clientX + document.body.scrollLeft;
		    posy = e.clientY + document.body.scrollTop;
	    }
	    return [ posx - refPoint.left, posy - refPoint.top ];
    }

    debug.info("interaction module is installed.");

})(OOPCanvas);



(function(OC) {


    OC.UIElement = UIElement;

    /**
     * @namespace
     */
    OC.UIControls = {};

    /**
     * @name UIElement
     * @exports UIElement as OOPCanvas.UIElement
     * @class The base class for all the UI Classes to extend
     */
    function UIElement(oc) {
        this._oc = oc;

        this._id = OC.Util.rand();
        this._zIndex = 0;

        this._left = null;
        this._top = null;
        this._centerX = null;
        this._centerY = null;
        this._config = null;

        this._isDirty = true;
        this._isHitTestVisible = true;

        this._eventEmitter = this._oc.eventEmitter();
        this._animator = null;
    }

    /**
     * @field
     */
    UIElement.Max_ZIndex = Number.MAX_VALUE;

    /**
     * @field
     */
    UIElement.Min_ZIndex = -UIElement.Max_ZIndex;

    /**
     * @returns the id of the UI Element
     */
    UIElement.prototype.getId = function() {
        return this._id;
    };

    UIElement.prototype.getZIndex = function() {
        return this._zIndex;
    };

    UIElement.prototype.setZIndex = function(index) {
        this._zIndex = index;

        this.invalidate();
    };

    UIElement.prototype.invalidate = function() {
        this._isDirty = true;
    };

    UIElement.prototype.isDirty = function() {
        return this._isDirty;
    };

    UIElement.prototype.setHitTestVisible = function(hitTestVisible) {
        this._isHitTestVisible = hitTestVisible;
    };

    UIElement.prototype.config = function(property, value) {
        if ( !this._config ) {
            this._config = {};
        }

        if ( typeof property === "object" ) {
            var oc = this._oc;
            oc.updateConfig(this._config, property);
        } else {
            this._config[property] = value;
        }

        this.invalidate();
    };

    UIElement.prototype.setPosition = function(left, top) {
        this._left = left;
        this._top = top;

        this.invalidate();
    };

    UIElement.prototype.bind = function(eventName, callback) {
        this._eventEmitter.subscribe(eventName, callback);
    };

    UIElement.prototype.unbind = function(eventName, callback) {
        this._eventEmitter.unsubscribe(eventName, callback);
    };

    UIElement.prototype.fire = function(eventName, eventArgs) {
        this._eventEmitter.fire(this, eventName, eventArgs);
    };

    UIElement.prototype.click = function(callback) {
        this.bind('click', callback);
    };

    UIElement.prototype.animate = function(props, duration, easingFunc) {
        if ( !this._animator ) {
            this._animator = this._oc.animator(this);
        }

        this._animator.start(props, duration, easingFunc);
    };

    UIElement.prototype.update = function(currentTime) {
        return this._update(currentTime);
    };

    UIElement.prototype.draw = function() {
        this._draw();
        this._isDirty = false;
    };

    UIElement.prototype.hitTest = function(x, y) {
        if ( !this._isHitTestVisible ) {
            return null;
        }

        var oc  = this._oc;
        var size = oc.getSize();
        var w = size.width;
        var h = size.height;
        var ctx = oc._getHitTestContext();
        ctx.clearRect(0, 0, w, h);

        var tmp = oc.getContext;
        oc.getContext = function() {
            return ctx;
        };

        var result = this._hitTest(x, y);

        oc.getContext = tmp;

        return result;
    };

    UIElement.prototype.testPointInPath = function(x, y) {
        return this._oc._hitTest(this, x, y);
    };


    UIElement.prototype._update = function(currentTime) {
        if (!!this._animator) {
            this._isDirty |= this._animator.update(currentTime);
        }

        return !!this._isDirty;
    };

    UIElement.prototype._draw = function() {};

    UIElement.prototype._hitTest = function(x, y) {};


    UIElement.prototype._click = function() {
        this.fire('click');
    };

    UIElement.prototype._mouseover = function() {
        this.fire('mouseover');
    };

    UIElement.prototype._mousemove = function() {
        this.fire('mousemove');
    };

    UIElement.prototype._mouseout = function() {
        this.fire('mouseout');
    };

    UIElement.prototype._mousedown = function() {
        this.fire('mousedown');
    };

    UIElement.prototype._mouseup = function() {
        this.fire('mouseup');
    };


    debug.info("ui module UIElement submodule is installed.");

})(OOPCanvas);

(function(OC) {

    /**
     * @namespace The collection of all the UI primitives
     */
    OC.UIPrimitives = {};


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

(function(OC) {


    OC.UIControls.Button = Button;

    /**
     */
    OC.prototype.button = function(left, top) {
        return new Button(this, left, top);
    };


    /**
     * @name Button
     * @exports Button as OOPCanvas.UIControls.Button
     * @class
     */
    function Button(oc, left, top) {
        Button.__super(this, 'constructor', oc, left, top, 0, 0);

        this._id = "Button-" + this._id;

        this._gradientNormal = null;
        this._gradientHover = null;
        this._gradientPress = null;

        this.setSize(300, 50);
        this._state = Button.States.Normal;
    }

    OC.Util.inherit(Button, OC.UIPrimitives.Rectangle);

    Button.States = {
        'Normal': 'Normal',
        'Hover': 'Hover',
        'Press': 'Press'
    };

    /**
     */
    Button.prototype.setSize = function(width, height) {
        this._width = width;
        this._height = height;

        _createGradients(this);

        this.invalidate();
    };


    Button.prototype._draw = function() {
        var oc = this._oc;
        oc.drawRectangle(this._left, this._top, this._width, this._height, {
            'fillStyle': _getCurGredient(this),
            'strokeStyle': 'transparent',
            'cornerRadius': 6
        });
        oc.drawLine(this._left, this._top, this._left + 20, this._top + 20);
    };


    Button.prototype._click = function() {
        Button.__super(this, '_click');
    };

    Button.prototype._mouseover = function() {
        this._oc.changeCursor('pointer');
        _setState(this, Button.States.Hover);
        Button.__super(this, '_mouseover');
    };

    Button.prototype._mousemove = function() {
        Button.__super(this, '_mousemove');
    };

    Button.prototype._mouseout = function() {
        this._oc.changeCursor('default');
        _setState(this, Button.States.Normal);
        Button.__super(this, '_mouseout');
    };


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

    debug.info("UI module Button submodule is installed.");

})(OOPCanvas);



(function (OC) {


    OC.initialize(function(oc) {
        oc._visualManager = new VisualManager(oc);

        oc.installHook(function(oc) {
            oc._visualManager.render();
        });

        debug.info("visualManager module is init'ed.");
    });


    OC.prototype.addChild = function (child) {
        this._visualManager.addChild(child);
    };

    OC.prototype.addChildren = function (children) {
        this._visualManager.addChildren(children);
    };

    OC.prototype.removeChildById = function (id) {
        this._visualManager.removeChildById(id);
    };

    OC.prototype.removeChild = function (child) {
        this._visualManager.removeChild(child);
    };

    OC.prototype.removeChildren = function (children) {
        this._visualManager.removeChildren(children);
    };

    OC.prototype.removeAll = function () {
        this._visualManager.removeChildren();
    };


    /**
     * @name VisualManager
     * @class Visual Manager acts as a gateway, between the system and
     * UIElements. <br/><br/>
     * This class is <b>NOT</b> exposed for public use, as it functions as
     * a singleton per OOPCanvas instance, and is managed by its OOPCanvas
     * instance. However, it adds functions to OOPCanvas, which in turn interacts with
     * other modules.
     */
    function VisualManager (oc) {
        this._oc = oc;

        this._children = new OC.Collections.Dict(function(c1, c2) {
            return c1.getZIndex() - c2.getZIndex();
        });

        this._isDirty = true;
        this._hitTestResults = [];
        this._lastHitTestElement = null;
    }

    VisualManager.prototype.addChild = function (child) {
        var id = child.getId();
        this._children.add(id, child);
        this._isDirty = true;
    };

    VisualManager.prototype.addChildren = function(children) {
        var kvs = [];
        var i, child, kv;
        var count = children.length;

        for ( i = 0; i < count; i++ ) {
            child = children[i];
            kv = [ child.getId(), child ];
            kvs.push(kv);
        }

        this._children.addItems(kvs);
        this._isDirty = true;
    };

    VisualManager.prototype.removeChildById = function (id) {
        if ( this._children.contain(id) ) {
            this._children.remove(id);
            this._isDirty = true;
        }
    };

    VisualManager.prototype.removeChild = function (child) {
        var id = child.getId();
        this.removeChildById(id);
    };

    VisualManager.prototype.removeChildren = function(children) {
        this._isDirty = true;

        if (typeof children === "undefined") {
            this._children.removeAll();
            return;
        }

        var ids = [];
        var i, child;
        var count = children.length;

        for ( i = 0; i < count; i++) {
            child = children[i];
            ids.push(child.getId());
        }

        this._children.removeItems(ids);
    };

    VisualManager.prototype.render = function() {
        _hitTest(this);

        if ( _update(this) ) {
            _clear(this);
            _draw(this);
            this._isDirty = false;
        }
    };

    function _hitTest (vm) {
        var oc = vm._oc;
        var evt = oc._dequeueEvent();
        var hit;

        if (!evt) {
            return;
        }

        var htrs = vm._hitTestResults;
        htrs.length = 0;
        vm._children.iterate(function(key, child) {
            var hr = child.hitTest(evt.left, evt.top);
            if ( !!hr ) {
                hr.event = evt;
                htrs.unshift(hr);
            }
        });

        hit = htrs[0];
        htrs.length = 0;

        var lastHTElm = vm._lastHitTestElement;

        if ( !!lastHTElm && ( !hit || lastHTElm.getId() != hit.element.getId() ) ) {
            _sendEvent(vm._lastHitTestElement, 'mouseout');
        }

        if ( !!hit ) {
            var elm = hit.element;
            var eventType = hit.event.type;

            if ( eventType === "mousemove" && ( !lastHTElm || lastHTElm.getId() != hit.element.getId() ) ) {
                hit.event.type = "mouseover";
            }

           _sendEvent(elm, hit.event.type);
        }

        vm._lastHitTestElement = !!hit ? hit.element : null;
    }

    function _sendEvent (element, eventName) {
        element["_" + eventName]();
    }

    function _update (vm) {
        var isDirty = vm._isDirty;
        var curTime = new Date().getTime();
        vm._children.iterate(function(key, child) {
            isDirty |= child.update(curTime);
        });
        return !!isDirty;
    }

    function _clear (vm) {
        var oc = vm._oc;
        oc.clearAll();
    }

    function _draw (vm) {
        vm._children.iterate(function(key, child) {
            child.draw();
        });
    }

    debug.info("visualManager module is installed.");

})(OOPCanvas);

