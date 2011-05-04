//= require "oc.bootstrapper"
//= require "oc.core"

window.OOPCanvas.modules.interaction = function _interaction (OOPCanvas) {

    var OC = OOPCanvas;
    var fn = OC.prototype;

    _interaction.init = function (oc) {
        oc._interaction = new Interaction(oc);

        debug.info("interaction module is init'ed.");
    };

    // == Interaction Class ==

    function Interaction (oc) {
        this._oc = oc;
        this._canvas = this._oc.getCanvas();
        
        _registerEventHandlers(this);
    }

    function _registerEventHandlers (ia) {
        var canvas = ia._canvas;

        canvas.onmouseover = function (evt) {
            //debug.debug("on mouse over");
        };

        canvas.onmouseout = function (evt) {
            //debug.debug("on mouse out");
        };

        canvas.onmousemove = function (evt) {
            //debug.debug("on mouse move");
        };

        canvas.onmousedown = function (evt) {
            //debug.debug("on mouse down");
        };

        canvas.onmouseup = function (evt) {
            //debug.debug("on mouse up");
        };
    }

    debug.info("interaction module is installed.");
};
