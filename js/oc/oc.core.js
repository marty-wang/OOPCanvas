//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.runloop"

(function (OOPCanvas) {
    
    var OC = OOPCanvas;
    var fn = OC.prototype;

    OC.create = function(canvas, globalConfig) {
        var oc = new OC(); 
        oc._core = new Core(canvas, globalConfig);
        oc.initModules();
        
        return oc;
    };

    OC.initialize( function(oc) {
        oc.installPostHook(function(oc) {
            oc.render();
        });

        debug.info("core module is init'ed.");
    } );

    // == Getters and Setters ==
    
    fn.changeCursor = function(cursor) {
        this._core._canvas.style.cursor = cursor;
    };

    fn.getLeft = function() {
        return this._core._left;
    };

    fn.getTop = function() {
        return this._core._top;
    };

    fn.getWidth = function() {
        return this._core._width;
    };

    fn.getHeight = function() {
        return this._core._height;
    };

    fn.getCanvas = function () {
        return this._core._canvas;
    };

    fn.getContext = function() {
        var core = this._core;
        return core.useBackBuffer() ? core._backBufferCtx : core._ctx;
    };

    fn.render = function() {
        var core = this._core;
        if (core.useBackBuffer()) {
            core._ctx.drawImage(core._backBuffer, 0, 0);
        }
    };

    fn.clear = function(x, y, width, height) {
        var core = this._core;
        core._ctx.clearRect(x, y, width, height);
        if (!!core._backBufferCtx) {
            core._backBufferCtx.clearRect(x, y, width, height);
        }
    };

    fn.clearAll = function() {
        this.clear(0, 0, this.getWidth(), this.getHeight());
    };

    fn.getGlobalConfig = function() {
        return this._core._globalConfig;
    };

    // ==========
    // == Core ==
    // ==========

    function Core (canvas, globalConfig) {
        if (!canvas) {
            throw "Canvas cannot be null or undefined";
        }

        this._ctx = canvas.getContext('2d');
        if (!this._ctx) {
            throw "The passed-in canvas argument is not valid";
        }

        this._canvas = canvas;

        this._backBuffer = null;
        this._backBufferCtx = null;

        var pos = OC.Util.domElementPosition(canvas);
        this._left = pos.left;
        this._top = pos.top;
        this._width = canvas.getAttribute('width');
        this._height = canvas.getAttribute('height');

        this._config = {
            'useBackBuffer': false
        };
    
        this._globalConfig = globalConfig || {};
        OC.Util.sync(this._config, this._globalConfig);

        if (this._config.useBackBuffer) {
            _createBackBuffer(this);
        }
    }

    Core.prototype.useBackBuffer = function() {
        return this._config.useBackBuffer;
    };

    // == private ==

    function _createBackBuffer (core) {
        var backBuffer = document.createElement('canvas');
        backBuffer.width = core._width;
        backBuffer.height = core._height;
        core._backBufferCtx = backBuffer.getContext('2d');
        core._backBuffer = backBuffer;
    }

    debug.info("core module is installed.");

})(OOPCanvas);
