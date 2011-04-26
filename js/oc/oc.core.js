//= require "../lib/ba-debug.min.js"

var OOPCanvas = (function(undefined) {
    
    // log (1) < debug (2) < info (3) < warn (4) < error (5)
    // If 0, disables logging.
    debug.setLevel(3);
    
    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'https://github.com/marty-wang/OOPCanvas',
        'license': 'MIT'
    };

    // == Constructor ==

    function OOPCanvas (canvas, globalConfig) {
        if (!canvas) {
            throw "Canvas cannot be null or undefined";
        }

        this._ctx = canvas.getContext('2d');
        if (!this._ctx) {
            throw "The passed-in canvas argument is not valid";
        }

        this._width = canvas.getAttribute('width');
        this._height = canvas.getAttribute('height');
    
        this._children = {};

        this._globalConfig = globalConfig || {};

        _initModules(this);
    }

    // == Getters and Setters ==

    OOPCanvas.prototype.getWidth = function() {
        return this._width;
    };

    OOPCanvas.prototype.getHeight = function() {
        return this._height;
    };

    OOPCanvas.prototype.getContext = function() {
        return this._ctx;
    };

    OOPCanvas.prototype.getGlobalConfig = function() {
        return this._globalConfig;
    };

    // == Protected Methods ==
    
    // TODO: move children management into module
    
    OOPCanvas.childIdCounter = -1;

    OOPCanvas.prototype._addChild = function(child) {
        var id = child.getId();
        var children = this._children;
        if ( ~~children[id] ) {
            return;
        }

        children[id] = child;
    };

    // == Static ==
    
    OOPCanvas.modules = {};

    OOPCanvas.installModules = function (moduleSettings) {
        moduleSettings = moduleSettings || {};
        _iterateModules(function(m, mk) {
            m(OOPCanvas, moduleSettings[mk]);
        });
    };

    // == Private ==

    function _initModules (oc) {
        _iterateModules(function(m) {
            if (m.init) {
                m.init(oc);
            }
        });
    }

    function _iterateModules (callback) {
        var mk, module;
        var modules = OOPCanvas.modules;

        for (mk in modules) {
            if (Object.prototype.hasOwnProperty.call(modules, mk)) {
                module = modules[mk];
                callback(module, mk);
            }
        }
    }

    return OOPCanvas;

})();

'OC' in window || (window.OC = OOPCanvas);
