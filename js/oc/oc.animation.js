//= require "oc.bootstrapper"
//= require "oc.util"

window.OOPCanvas.modules.animation = function (OOPCanvas) {
    
    var OC = OOPCanvas;
    var fn = OC.prototype;

    // namespace
    OC.Animation = {};

    // const
    var DEFAULT_ANIMATION_DURATION = 250; // in ms

    fn.animator = function(obj) {
        return new Animator(obj);
    };

    // == Animator Constructor ==
    // object: the object whose properties are animated by animator
    function Animator (obj) {
        this._object = obj;

        this._bv = null;
        this._ev = null;
        this._cv = null;
        
        // the properties that will be animated
        // not necessarily == the props that the user asks to animate
        // because only properties that have differences in values will be
        // animated.
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

    // TODO: maybe there is a better way to deal with arguments
    // optional kwargs: duration, easingFunction, callbacks
    // callbacks: start, animating, complete
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

    Animator.prototype.update = function(currentTime) {

        if (!this._isAnimating) {
            return;
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
            func = OC.Animation.easingFunctions[easingFunc];
        } else {
            func = easingFunc;
        }
        
        if (!func) {
            func = OC.Animation.easingFunctions.linear;
        }

        return func;
    }
    
    // t: current time, b: beginning value, d: duration
    // c: end value - beginning value
    OC.Animation.easingFunctions = {
        'linear': function (t, b, c, d) {
            return c*t/d + b;
        }
    }

    // 3rd party and plugins should use this method to add easing functions.
    // the easing function should request the arguments of t, b, c, d
    OC.Animation.addEasingFunction = function(name, func) {
        var efs = OC.Animation.easingFunctions;

        if ( name in efs) {
            throw '"' + name + '" easing function already exists!';
        }

        efs[name] = func;
    };

    debug.info("animation module is installed.");

};
