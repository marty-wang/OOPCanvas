//= require "oc.core"

window.OOPCanvas.modules.runloop = function _runloop(OOPCanvas) {

    console.log("runloop is installed");
    
    var OC = OOPCanvas;
    var fn = OC.prototype;

    // default config
    var _config = {
        'fps': 60
    };

    var _timeout = null;

    var _shouldRun = null;
    var _isLooping = null;

    var _lastFrame = null;
    var _curFPS = null;

    var _postHooks = [];

    _runloop.init = function(ocObj) {
        console.log("runloop is init'ed");

        var gConfig = ocObj.getGlobalConfig();
        
        if (gConfig.fps) {
            _config.fps = gConfig.fps;
        } else {
            gConfig.fps = _config.fps;
        }

        _timeout = 1000 / _config.fps;
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
        
        _lastFrame = new Date().getTime();
        _shouldRun = true;
        _loop(this);
    };

    fn.stopRunloop = function() {
        if (_isLooping) {
            _shouldRun = false;
        }
    };

    function _loop (oc) {
        setTimeout(function() {
            _framing(oc);

            if (_shouldRun) {
                _loop(oc);
                _isLooping = true;
            } else {
                _isLooping = false;
            }
        }, _timeout);
    }

    function _framing (oc) {
        _calcCurFrame();
        _running(oc);
        _callPostHooks(oc);
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
        _curFPS = ~~(1000 / dt);
        _lastFrame = curFrame;
    }

};
