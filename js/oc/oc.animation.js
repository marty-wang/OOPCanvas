//= require "oc.bootstrapper"
//= require "oc.util"

(function (OC) {
    
    // ++ Augument OOPCanvas ++
    
    OC.Animator = Animator;

    /**
     * shorthand method to create animator
     */
    OC.prototype.animator = function(obj) {
        return new Animator(obj);
    };
    
    // == Animator ==
    
    // const
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

    /**
     * @namespace
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

    // TODO: maybe there is a better way to deal with arguments
    // optional kwargs: duration, easingFunction, callbacks
    // callbacks: start, animating, complete
    
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
