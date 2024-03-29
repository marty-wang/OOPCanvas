//= require "oc.core"
//= require "oc.drawing"
//= require "oc.runloop"

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
