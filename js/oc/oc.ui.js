//= require "oc.core"
//= require "oc.drawing"

window.OOPCanvas.modules.ui = function(OOPCanvas) {
    
    var OC = OOPCanvas;
    var fn = OC.prototype;

    fn.createRect = function(x, y, width, height, config) {
        
        var oc = this;

        function Rect (x, y, width, height, config) {
            this._id = "Rect-" + (++OC.childIdCounter);

            this._render.apply(this, arguments);
            oc._addChild(this);
        }

        Rect.prototype.getId = function() {
            return this._id;
        };
        
        Rect.prototype._render = function(x, y, width, height, config) {
            oc.drawRect.apply(oc, arguments);
        };

        return new Rect(x, y, width, height, config);
    };

    debug.info("ui module is installed.");
};
