//= require "oc.core"
//= require "oc.animation"

window.OOPCanvas.modules.easing = function (OOPCavnas) {
    var OC = OOPCanvas;
    var ef = OC.Animation.easingFunctions;

    var undefined;

    // Rober Penner's Easing Equations
    // http://snippets.dzone.com/posts/show/4005
    // t: current time, b: beginning value, d: duration
    // c: end value - beginning value

    // == QUADRATIC ==

    ef.easeInQuad =  function (t, b, c, d) {
        t = t / d;
        return c*t*t + b;
    };

    ef.easeOutQuad = function (t, b, c, d) {
        t = t / d;
        return -c*t*(t-2) + b;
    };

    ef.easeInOutQuad = function (t, b, c, d) {
        t = t / (d/2);
        if ( t < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    };

    // CUBIC

    ef.easeInCubic = function (t, b, c, d) {
        return c*(t/=d)*t*t + b;
    };

    ef.easeOutCubic = function (t, b, c, d) {
        t = t / d - 1;
        return c*(t*t*t + 1) + b;
    };

    ef.easeInOutCubic = function (t, b, c, d) {
        t = t / ( d / 2);
        if (t < 1) {
            return c/2*t*t*t + b;
        }
        t = t - 2;
        return c/2*(t*t*t + 2) + b;
    };    

    // QUARTIC

    ef.easeInQuart = function (t, b, c, d) {
        t = t / d;
        return c*t*t*t*t + b;
    };

    ef.easeOutQuart = function (t, b, c, d) {
        t = t / d - 1;
        return -c * (t*t*t*t - 1) + b;
    };

    ef.easeInOutQuart = function (t, b, c, d) {
        t = t / ( d / 2 );
        if (t < 1) {
            return c/2*t*t*t*t + b;
        }
        t = t - 2;
        return -c/2 * (t*t*t*t - 2) + b;
    };

    // QUINTIC

    ef.easeInQuint = function (t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    };

    ef.easeOutQuint = function (t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    };

    ef.easeInOutQuint = function (t, b, c, d) {
        t = t / ( d / 2 );
        if (t < 1) {
            return c/2*t*t*t*t*t + b;
        }

        t = t - 2;
        return c/2*(t*t*t*t*t + 2) + b;
    };
    
    // SINUSOIDAL
    
    ef.easeInSine = function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    };

    ef.easeOutSine = function (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    };

    ef.easeInOutSine = function (t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };   

    // EXPONENTIAL

    ef.easeInExpo = function (t, b, c, d) {
        return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    };

    ef.easeOutExpo = function (t, b, c, d) {
        return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    };

    ef.easeInOutExpo = function (t, b, c, d) {
        if (t===0) {
            return b;
        }
        if (t===d) {
            return b+c;
        }
        t = t / ( d / 2);
        if ( t < 1) {
            return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };
    

    // CIRCULAR
    
    ef.easeInCirc = function (t, b, c, d) {
        t = t / d;
        return -c * (Math.sqrt(1 - t*t) - 1) + b;
    };

    ef.easeOutCirc = function (t, b, c, d) {
        t = t / d - 1;
        return c * Math.sqrt(1 - t*t) + b;
    };

    ef.easeInOutCirc = function (t, b, c, d) {
        t = t / ( d / 2);
        if ( t < 1 ) {
            return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        }
        t = t - 2;
        return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    };
    

    // ELASTIC

    ef.easeInElastic = function (t, b, c, d, a, p) {
        if ( t === 0 ) {
            return b;
        }
        
        t = t / d;
        if ( t === 1 ) {
            return b+c;
        }
        
        if ( p === undefined ) {
            p = d * 0.3;
        }

        var s;
        if ( ~~a < Math.abs( c ) ) {
            a = c; 
            s= p / 4; 
        } else {
            s = p / ( 2 * Math.PI ) * Math.asin( c / a );
        }
        
        t = t - 1;
        return -( a * Math.pow( 2, 10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
    };

    ef.easeOutElastic = function (t, b, c, d, a, p) {
        if ( t === 0 ) {
            return b;
        }  
        
        t = t / d;
        if ( t === 1 ) {
            return b+c;
        }
        
        if ( p === undefined ) {
            p = d * 0.3;
        }

        var s;
        if ( ~~a < Math.abs( c ) ) {
            a = c; 
            s = p / 4; 
        } else {
            s = p / ( 2 * Math.PI ) * Math.asin( c / a );
        }

        return a * Math.pow(2, -10 * t) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) + c + b;
    };

    ef.easeInOutElastic = function (t, b, c, d, a, p) {
        if ( t === 0 ) {
            return b;
        }

        t = t / ( d / 2);
        if ( t === 2 ) {
            return b+c;
        } 
        
        if ( p === undefined ) {
            p = d * ( 0.3 * 1.5 );
        }
        
        var s;
        if ( ~~a < Math.abs( c ) ) { 
            a = c; 
            s = p/4; 
        } else {
            s = p / ( 2 * Math.PI ) * Math.asin( c / a );
        }

        if ( t < 1 ) {
            t = t - 1;
            return -0.5 * ( a * Math.pow(2, 10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
        }

        t = t - 1;
        return a * Math.pow( 2, -10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) * 0.5 + c + b;
    };

    // == BACK ==

    ef.easeInBack = function (t, b, c, d, s) {
        if ( s === undefined ) {
            s = 1.70158;
        }
        t = t / d;
        return c * t * t * ( ( s + 1 ) * t - s ) + b;
    };

    ef.easeOutBack = function (t, b, c, d, s) {
        if ( s === undefined ) {
            s = 1.70158;
        }

        t = t / d - 1;
        return c * ( t * t * ( ( s + 1 ) * t + s ) + 1 ) + b;
    };

    ef.easeInOutBack = function (t, b, c, d, s) {
        if ( s === undefined ) {
            s = 1.70158;
        }
        t = t / ( d / 2 );
        s = s * 1.525;
        if ( t < 1 ) {
            return c / 2 * ( t * t * ( ( s + 1 ) * t - s ) ) + b;
        }

        t = t - 2;
        return c / 2 * ( t * t * ( ( s + 1 ) * t + s ) + 2 ) + b;
    };   
        
    // == BOUNCE ==
    
    ef.easeInBounce = _easeInBounce;
        
    ef.easeOutBounce = _easeOutBounce;

    ef.easeInOutBounce = function (t, b, c, d) {
        if (t < d/2) {
            return _easeInBounce (t*2, 0, c, d) * 0.5 + b;
        }
        return _easeOutBounce (t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    };

    // == Private ==
        
    function _easeInBounce (t, b, c, d) {
	    return c - _easeOutBounce (d-t, 0, c, d) + b;
    }

    function _easeOutBounce (t, b, c, d) {
        t = t / d;
        if (t < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            t = t - (1.5/2.75);
            return c*(7.5625*t*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            t = t - (2.25/2.75);
            return c*(7.5625*t*t + 0.9375) + b;
        } else {
            t = t - (2.625/2.75);
            return c*(7.5625*t*t + 0.984375) + b;
        }
    }
    
    debug.info("easing module is installed.");
};
