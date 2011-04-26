//= require "oc.core"
//= require "oc.util"
//= require "oc.logger"

window.OOPCanvas.modules.runloop = function _runloop (OOPCanvas) {
    
    var OC = OOPCanvas;
    var fn = OC.prototype;

    var DEFAULT_FPS = 60;

    // default config
    var _config = {
        'fps': DEFAULT_FPS,
        'useOptimizedRunloop': false // overwrite fps to 0
    };

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

        OC.info("runloop module is init'ed.");
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
        // TODO: implement
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
                 _requestLoopFrame(run, _config.fps);
                _isLooping = true;
            } else {
                _isLooping = false;
            }
        })();
    
    }

    // fps: if omitted, let browser optimize
    function _requestLoopFrame (callback, fps) {
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

        func(callback, 1000 / fps);
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

    OC.info("runloop module is installed.");
};
