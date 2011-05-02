//= require "oc.util"

window.OOPCanvas.modules.runloop = function _runloop (OOPCanvas) {
    
    var OC = OOPCanvas;
    var fn = OC.prototype;
    
    var undefined;

    // const
    var DEFAULT_FPS = 60;
    
    // ## init ##
    _runloop.init = function(oc) {
        oc._runloop = new Runloop(oc);

        debug.info("runloop module is init'ed.");
    };

    // ++ Add Methods to OOPCanvas ++

    fn.startRunloop = function() {
        this._runloop.startLoop();
    };

    fn.stopRunloop = function() {
        this._runloop.stopLoop();
    };
    
    fn.isLooping = function() {
        return this._runloop._isLooping;
    };

    fn.getCurrentFPS = function() {
        return this._runloop._curFPS;
    };

    fn.installHook = function(hook) {
        this._runloop._hooks.push(hook);  
    };

    fn.removeHook = function(hook) {
        // TODO: implement
    };

    //stack-ish: first-in-last-out
    fn.installPostHook = function(hook) {
        this._runloop._postHooks.unshift(hook);
    };

    fn.removePostHook = function(hook) {
        // TODO: implement
    };

    // ++ End of Adding Methods to OOPCanvas ++
    
    // =============
    // == Runloop ==
    // =============
    
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

    Runloop.prototype.startLoop = function() {
        if (this._isLooping) {
            return;
        }
        
        if (!!this._requestFrameFunc) {
            this._shouldRun = true;
        }
        _loop(this);

    };

    Runloop.prototype.stopLoop = function() {
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

    // == private ==

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

    // fps: if omitted, let browser optimize
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
            // func is the browser's requestAnimationFrame
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

    // =====================
    //  == end of Runloop ==
    //  ====================

    debug.info("runloop module is installed.");
};
