//= require "oc.bootstrapper"
//= require "oc.util"
//= require "oc.runloop"

(function (OC) {

    // ## init ##

    OC.initialize( function(oc) {
        oc.installPostHook(function(oc) {
            _render(oc);
        });

        debug.info("core module is init'ed.");
    } );

    // ++ Add Methods to OOPCanvas ++
    
    /**
     * Should always use this method to create OOPCanvas instance.
     * @returns the OOPCanvas instance
     */
    OC.create = function(canvas, globalConfig) {
        var oc = new OC(); 
        oc._core = new Core(canvas, globalConfig);
        oc.initModules();
        
        return oc;
    };
    
    /**
     * @function
     */
    OC.prototype.changeCursor = function(cursor) {
        this._core._canvas.style.cursor = cursor;
    };
    
    /**
     * get the absoulte position of the canvas in the HTML document
     * @returns object that has properties of left and top
     */
    OC.prototype.getPosition = function() {
        return this._core._position;
    };

    /**
     * get the canvas size
     * @returns object that has propertis of width and height
     */
    OC.prototype.getSize = function() {
        return {
            'width': this._core._width,
            'height': this._core._height
        };
    };
    
    /**
     * @returns the HTML canvas element
     */
    OC.prototype.getCanvas = function () {
        return this._core._canvas;
    };

    /**
     * returns the rendering context. Depending on the configuration it can
     * return the regular context or the backbuffer context.
     */
    OC.prototype.getContext = function() {
        var core = this._core;
        return core.useBackBuffer() ? core._backBufferCtx : core._ctx;
    };

    /**
     * clear the specific area
     */
    OC.prototype.clear = function(x, y, width, height) {
        var core = this._core;
        core._ctx.clearRect(x, y, width, height);
        if (!!core._backBufferCtx) {
            core._backBufferCtx.clearRect(x, y, width, height);
        }
    };

    /**
     * clear the entrie canvas
     */
    OC.prototype.clearAll = function() {
        var size = this.getSize();
        this.clear(0, 0, size.width, size.height);
    };

    /**
     * return the global configuration
     */
    OC.prototype.getGlobalConfig = function() {
        return this._core._globalConfig;
    };

    // == Private Methods ==

    function _render (oc) {
        var core = oc._core;
        if (core.useBackBuffer()) {
            core._ctx.drawImage(core._backBuffer, 0, 0);
        }
    }

    /**
     * @name Core
     * @class Core is the rendering engine.<br/>
     * Configuration: <b>useBackBuffer</b>(default: false) <br/><br/>
     * <i>This class is <b>NOT</b> exposed for public use, as it functions as 
     * a singleton per OOPCanvas instance, and is managed by its OOPCanvas 
     * instance. However, it adds functions to OOPCanvas, which in turn interacts with
     * other modules and public objects.</i>
     */

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

        this._position = OC.Util.domElementPosition(canvas);
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
