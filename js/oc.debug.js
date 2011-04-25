// require: oc.core.js
// require: oc.drawing.js
// require: oc.runloop.js

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
        fps_info = fps_info.substr(0, 2);
        var color = "green";
        if (fps < 30) {
            color = "red";
        }
        oc.drawText(0, 0, fps_info, {
            'fillStyle': color
        });
    }
};
