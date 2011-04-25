// TODO: refactor merge function into oc.lib.js

//= require "oc.core"

window.OOPCanvas.modules.util = function(OOPCanvas) {

    var OC = OOPCanvas;

    // mutable: wether it will chage the merging object or not
    // excludes: the array containing the names of properties that should not be
    // merged
    OC.merge = function _merge (merging, merged/*, mutable, excludes*/) {
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

};
