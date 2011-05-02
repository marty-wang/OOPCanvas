//= require "../lib/ba-debug.min"

var OOPCanvas = (function(window, document, undefined) {
    
    debug.setLevel(0);
    
    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'git@github.com:marty-wang/OOPCanvas.git',
        'license': 'MIT'
    };

    // bootstrapper constructor
    function OOPCanvas () {}

    OOPCanvas.prototype.initModules = function() {
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
    
    OOPCanvas.modules = {};
    OOPCanvas._inits = [];
    OOPCanvas.isModulesInstalled = false;

    OOPCanvas.installModules = function (moduleSettings) {
        if (OOPCanvas.isModulesInstalled) {
            return;
        }
        debug.info("=== Start to Install Modules ===");

        moduleSettings = moduleSettings || {};
        _iterateModules(OOPCanvas.modules, function(m, mk) {
            _installModule(m, moduleSettings[mk]);
        });
        OOPCanvas.isModulesInstalled = true;
        
        debug.info("=== Completed Modules Installation ===");
    };
  
    OOPCanvas.installPlugin = function(namespace, creator) {
        var fn = OOPCanvas.prototype;

        fn[namespace] = function() {
            if (!!creator) {
                return creator.apply(this, arguments);
            }
        };
    };
    
    // == Private ==

    function _iterateModules (modules, callback) {
        var mk, module;
        for (mk in modules) {
            if (Object.prototype.hasOwnProperty.call(modules, mk)) {
                module = modules[mk];
                if (typeof module === "function") {
                    callback(module, mk);
                } else if (typeof module === "object") {
                    _iterateModules(module, callback);
                }
            }
        }
    }

    function _installModule (module, setting) {
        module(OOPCanvas, setting);
        if (!!module.init) {
            OOPCanvas._inits.push(module.init);
        }
    } 
        
    return OOPCanvas;

})(window, document);

'OC' in window || (window.OC = OOPCanvas);

