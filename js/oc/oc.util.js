//= require "oc.core"

(function(OC) {

    /**
     * @namespace
     */
    OC.Util = {};
    
    /**
     * @exports Util as OOPCanvas.Util
     */
    var Util = OC.Util; 

    /**
     * @static
     */
    Util.hasOwnProperty = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    /**
     * @static
     */
    OC.Util.iterateProperties = function(props, callback) {
        var prop;
        var util = this;
        for ( prop in props) {
            if ( util.hasOwnProperty(props, prop) ) {
                callback(prop, props[prop]);
            }
        }
    };


    /**
     * @param {Object} merging the object is merging
     * @param {Object} merged the object is being merged
     * @param {Boolean} [mutable="false"] wether or not the merging object will be
     * mutated
     * @param {Array} [excludes="[]"] the array containing the names of properties that should not be
     * merged
     * @returns the object of merging result
     */
    OC.Util.merge = function _merge (merging, merged/*, mutable, excludes*/) {
        var arg2 = arguments[2];
        var arg3 = arguments[3];

        // default values
        var mutable = false;
        var excludes = [];

        if (typeof arg2 === "boolean") {
            mutable = arg2;
            if (typeof arg3 === "object") {
                excludes = arg3;
            }
        } else if (typeof arg2 === "object") {
            excludes = arg2;
        }

        var orig = {};
        if (!mutable) {
            orig = _merge(orig, merging, true);
        } else {
            orig = merging;
        }

        var prop;
        
        for (prop in merged) {
            if ( excludes.indexOf(prop) > -1 ) {
                continue;
            }
            if (OC.Util.hasOwnProperty(merged, prop)) {
                orig[prop] = merged[prop];
            }
        }

        return orig;
    };

    /**
     * sync two objects to have the same values of obj1's properties obj2's value weighs higher
     */
    OC.Util.sync = function (obj1, obj2) {
        var k;
        for ( k in obj1 ) {
            if (OOPCanvas.Util.hasOwnProperty(obj1, k)) {
                if ( k in obj2 ) {
                    obj1[k] = obj2[k];
                } else {
                    obj2[k] = obj1[k];
                }
            }
        }
    };
    
    /**
     * generate the rand number
     * @requires Math.uuid.js 
     */
    OC.Util.rand = function(seed) {
        seed = seed || 10;
        return Math.uuid(seed);
    };

    /**
     * Helper function that implements (pseudo)Classical inheritance inheritance.
     * @see http://www.yuiblog.com/blog/2010/01/06/inheritance-patterns-in-yui-3/
     * @param {Function} childClass
     * @param {Function} parentClass
     */
    OC.Util.inherit = function (childClass, parentClass) {
        var tempClass = function() {
        };
        tempClass.prototype = parentClass.prototype;
        childClass.prototype = new tempClass();            
        childClass.prototype.constructor = childClass;
        childClass.__super = function(obj, methodName) {
            var func = parentClass.prototype[methodName];
            if ( !!func ) {
                var args = Array.prototype.slice.call(arguments, 2);
                return func.apply(obj, args);
            }
        };
    };

    // == Dom ==

    /**
     * @param {HTMLElement} element
     * @returns the absolute position of the dom element in the HTML document
     */
    OC.Util.domElementPosition = function (obj){
        var curleft = 0;
        var curtop = 0;
        if(obj.offsetParent) {
            while(1) {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                if(!obj.offsetParent) {
                    break;
                }
                obj = obj.offsetParent;
            }
        } else {
            if(obj.x) {
                curleft += obj.x;
            }

            if(obj.y) {
                curtop += obj.y;
            }
        }
        return {
            'left': curleft,
            'top': curtop
        };
    };

    // == Array ==
    
    /**
     * @param {Array} array 
     * @prarm item
     * @returns the index of the item in the array
     */
    OC.Util.arrayIndexOf = function(array, obj) {
        var idx = -1;
        if (array.indexOf) {
            idx = array.indexOf(obj);
        } else {
            var i, count;
            for (i = 0, count = array.length; i < count; i++) {
                var o = array[i];
                if ( o === obj ) {
                    idx = i;
                    break;
                }
            }
        }

        return idx;
    };

    /**
     * @see <a href="http://ejohn.org/blog/javascript-array-remove/">http://ejohn.org/blog/javascript-array-remove/</a>
     */
    OC.Util.arrayRemove = function(array, from, to) {
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    };

    /**
     * remove the item from the array
     * @param {Array} array
     * @param item
     */
    OC.Util.arrayRemoveObject = function(array, obj) {
        var idx = this.indexOf(array, obj);
        if (idx < 0) {
            return;
        }

        OC.Util.arrayRemove(array, idx);
    };

})(OOPCanvas);

debug.info("util module is installed.");
