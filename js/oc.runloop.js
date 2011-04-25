window.OOPCanvas.modules.runloop = function(OOPCanvas) {
    
    var OC = OOPCanvas;
    var fn = OC.prototype;

    var fps = 60;
    var timeout = 1000 / fps;

    var _shouldRun = null;
    var _isLooping = null;

    var _lastFrame = null;
    var _curFPS = null;

    var _inDebugMode = true;
    
    fn.isLooping = function() {
        return _isLooping;
    };

    fn.getCurrentFPS = function() {
        return _curFPS;
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
        setTimeout(function() {
            _framing(oc);

            if (_shouldRun) {
                _loop(oc);
                _isLooping = true;
            } else {
                _isLooping = false;
            }
        }, timeout);
    }

    function _framing (oc) {
        _calcCurFrame();
        _running(oc);

        if (_inDebugMode) {
            _printDebugInfo(oc);
        }
    }

    function _running (oc) {
        _clear(oc);
        _update(oc);
        _render(oc);
    }

    function _clear (oc) {
        oc.clearAll();
    }

    function _update (oc) {
        
    }

    function _render (oc) {
    }

    function _calcCurFrame () {
        var dt, fps;
        var curFrame = new Date().getTime();
        if (~~_lastFrame) {
            dt = curFrame - _lastFrame;
            fps = 1000 / dt;
        }
        _curFPS = fps;
        _lastFrame = curFrame;
    }

    function _printDebugInfo (oc) {
        _printFPS(oc);
    }

    function _printFPS (oc) {
        var fps_info = "" + _curFPS;
        fps_info = fps_info.substr(0, 2);
        var color = "green";
        if (_curFPS < 30) {
            color = "red";
        }
        oc.drawText(0, 0, fps_info, {
            'fillStyle': color
        });
    }
};
