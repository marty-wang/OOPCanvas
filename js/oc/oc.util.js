//= require "oc.core"

window.OOPCanvas.modules.util = function(OOPCanvas) {
    
    (function() {

        this.Util = this.Util || {};
        this.Array = this.Array || {};

        // == Util ==

        // mutable: wether it will chage the merging object or not
        // excludes: the array containing the names of properties that should not be
        // merged
        this.Util.merge = function _merge (merging, merged/*, mutable, excludes*/) {
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
                if (OC.hasOwnProperty(merged, prop)) {
                    orig[prop] = merged[prop];
                }
            }

            return orig;
        };

        // == Array ==
        
        this.Array.indexOf = function(array, obj) {
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

        // http://ejohn.org/blog/javascript-array-remove/
        // Array Remove - By John Resig (MIT Licensed)
        this.Array.remove = function(array, from, to) {
            var rest = array.slice((to || from) + 1 || array.length);
            array.length = from < 0 ? array.length + from : from;
            return array.push.apply(array, rest);
        };

        this.Array.removeObject = function(array, obj) {
            var idx = Array.indexOf(array, obj);
            if (idx < 0) {
                return;
            }

            Array.remove(idx);
        };
        
    }).call(OOPCanvas);

};
