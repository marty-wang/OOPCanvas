//= require "oc.core"

window.OOPCanvas.modules.logger = function (OOPCanvas, moduleSetting) {
    
    var OC = OOPCanvas;

    var _levels = {
        'off': 0,
        'info': 1,
        'debug': 2,
        'all': 3
    };

    moduleSetting = moduleSetting || {};
    var _level = moduleSetting.level || 'off';

        
    OC.log = function(message, level) {
        level = level || 'debug';
        
        var priority = _levels[level];
        var targetPriority = _levels[_level];
        if (priority <= targetPriority) {
            console.log("" + level + ": " + message);
        }
    };

    OC.info = function(message) {
        OC.log(message, 'info');
    };

    OC.debug = function(message) {
        OC.log(message, 'debug');
    };

    OC.info("logger module is installed.");
};
