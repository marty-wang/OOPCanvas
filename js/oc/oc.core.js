var OOPCanvas = (function(undefined) {
    
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
    
    OOPCanvas.prototype._addChild = function(child) {
        var id = child.getId();
        var children = this._children;
        if ( ~~children[id] ) {
            return;
        }

        children[id] = child;
    };

    // == Static ==
    
    OOPCanvas.childIdCounter = -1;
    
    OOPCanvas.modules = {};

    OOPCanvas.installModules = function () {
        var OC = this;
        _iterateModules(function(m) {
            m(OC);
        });
    };

    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'https://github.com/marty-wang/OOPCanvas',
        'license': 'MIT'
    };

    // == Util ==

    OOPCanvas.Util = OOPCanvas.Util || {};

    OOPCanvas.Util.hasOwnProperty = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
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
            if (OOPCanvas.Util.hasOwnProperty(modules, mk)) {
                module = modules[mk];
                callback(module);
            }
        }
    }

    return OOPCanvas;

})();

'OC' in window || (window.OC = OOPCanvas);
