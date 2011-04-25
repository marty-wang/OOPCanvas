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

        this._globalConfig = globalConfig || {};
    
        this._children = {};        
    }

    // == Protected Methods ==
    
    OOPCanvas.prototype._addChild = function(child) {
        var id = child.getId();
        var children = this._children;
        if ( ~~children[id] ) {
            return;
        }

        children[id] = child;
    };

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

    // == Static ==
    
    OOPCanvas.childIdCounter = -1;
    
    OOPCanvas.modules = {};

    OOPCanvas.hasOwnProperty = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    OOPCanvas.installModules = function () {
        var mk, module;
        var modules = this.modules;

        for (mk in modules) {
            if (OOPCanvas.hasOwnProperty(modules, mk)) {
                module = modules[mk];
                module(this);
            }
        }
    };

    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'https://github.com/marty-wang/OOPCanvas',
        'license': 'MIT'
    };

    return OOPCanvas;

})();

'OC' in window || (window.OC = OOPCanvas);
