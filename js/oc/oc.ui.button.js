//= require "oc.bootstrapper"
//= require "oc.ui"
//= require "oc.ui.primitives"

(function(OC) {

    // == Augment OOPCanvas ==

    OC.UIControls.Button = Button;

    /**
     */
    OC.prototype.button = function(left, top) {
        return new Button(this, left, top);
    };

    // == Button ==
    
    /**
     * @name Button
     * @exports Button as OOPCanvas.UIControls.Button
     * @class
     */
    function Button(oc, left, top) {
        Button.__super(this, 'constructor', oc, left, top, 0, 0);
        
        this._id = "Button-" + this._id;
        
        this._gradientNormal = null;
        this._gradientHover = null;
        this._gradientPress = null;
        
        this.setSize(300, 50);
        this._state = Button.States.Normal;
    }

    OC.Util.inherit(Button, OC.UIPrimitives.Rectangle);

    Button.States = {
        'Normal': 'Normal',
        'Hover': 'Hover',
        'Press': 'Press'
    };
    
    /**
     */
    Button.prototype.setSize = function(width, height) {
        this._width = width;
        this._height = height;
        
        _createGradients(this);

        this.invalidate();
    };

    // Override Methods

    Button.prototype._draw = function() {
        var oc = this._oc;
        oc.drawRectangle(this._left, this._top, this._width, this._height, {
            'fillStyle': _getCurGredient(this),
            'strokeStyle': 'transparent',
            'cornerRadius': 6
        });
        oc.drawLine(this._left, this._top, this._left + 20, this._top + 20);
    };

    // == Event Handlers ==

    Button.prototype._click = function() {
        Button.__super(this, '_click');
    };

    Button.prototype._mouseover = function() {
        this._oc.changeCursor('pointer');
        _setState(this, Button.States.Hover);
        Button.__super(this, '_mouseover');
    };

    Button.prototype._mousemove = function() {
        Button.__super(this, '_mousemove');
    };

    Button.prototype._mouseout = function() {
        this._oc.changeCursor('default');
        _setState(this, Button.States.Normal);
        Button.__super(this, '_mouseout');
    };

    // == Private ==
    
    function _setState (button, state) {
        if ( button._state === state ) {
            return;
        }

        button._state = state;
        button.invalidate();
    }

    function _createGradients (button) {
        var oc = button._oc;
        var stops = [
            [0, '#b8e1fc'], [0.1, '#a9d2f3'] , 
            [0.25, '#90bae4'], [0.37, '#90bcea'], 
            [0.5, '#90bff0'], [0.51, '#6ba8e5'],
            [0.83, '#a2daf5'], [1, '#bdf3fd']
        ];
        button._gradientNormal = oc.createLinearGradient(0, 0, 0, button._height, stops);

        stops = [
            [0, '#3b679e'], [0.5, '#2b88d9'],
            [0.51, '#207cca'], [1, '#7db9e8']
        ];

        button._gradientHover = oc.createLinearGradient(0, 0, 0, button._height, stops);

        stops = [
            [0, '#1E5799'], [0.5, '#2989D8'],
            [0.51, '#207cca'], [1, '#7db9e8']
        ];

        button._gradientPress = oc.createLinearGradient(0, 0, 0, button._height, stops);
    }

    function _getCurGredient (button) {
        return button['_gradient' + Button.States[button._state]];
    }

    debug.info("UI module Button submodule is installed.");

})(OOPCanvas);
