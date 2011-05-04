//= require "oc.core"
//= require "../lib/Math.uuid"

window.OOPCanvas.modules.util = function(OOPCanvas) {
    
    (function() {

        var OC = this;

        this.Util = this.Util || {};
        this.Array = this.Array || {};
        this.Dom = this.Dom || {};
        
        // ==========
        // == Util ==
        // ==========

        this.Util.hasOwnProperty = function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };

        this.Util.iterateProperties = function(props, callback) {
            var prop;
            var util = this;
            for ( prop in props) {
                if ( util.hasOwnProperty(props, prop) ) {
                    callback(prop, props[prop]);
                }
            }
        };

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
                if (OC.Util.hasOwnProperty(merged, prop)) {
                    orig[prop] = merged[prop];
                }
            }

            return orig;
        };

        // sync two objects to have the same values of obj1's properties
        // obj2's value weighs higher
        this.Util.sync = function (obj1, obj2) {
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
                
        this.Util.rand = function(seed) {
            seed = seed || 10;
            return Math.uuid(seed);
        };

        /**
         * Helper function that implements (pseudo)Classical inheritance inheritance.
         * @see http://www.yuiblog.com/blog/2010/01/06/inheritance-patterns-in-yui-3/
         * @param {Function} childClass
         * @param {Function} parentClass
         */
        this.Util.inherit = function (childClass, parentClass) {
            /** @constructor */
            var tempClass = function() {
            };
            tempClass.prototype = parentClass.prototype;
            childClass.prototype = new tempClass();
            childClass.prototype.constructor = childClass;
            childClass.prototype.__super = function(methodName) {
                var func = parentClass.prototype[methodName];
                if ( !!func ) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    return func.apply(this, args);
                }
            };
        };

        // =========
        // == Dom ==
        // =========

        // http://blog.firetree.net/2005/07/04/javascript-find-position/
        this.Dom.getLeft = function (obj){
            var curleft = 0;
            if(obj.offsetParent) {
                while(1) {
                  curleft += obj.offsetLeft;
                  if(!obj.offsetParent) {
                    break;
                  }
                  obj = obj.offsetParent;
                }
            } else if(obj.x) {
                curleft += obj.x;
            }
            return curleft;
        };

        this.Dom.getTop = function (obj){
            var curtop = 0;
            if(obj.offsetParent) {
                while(1) {
                  curtop += obj.offsetTop;
                  if(!obj.offsetParent) {
                    break;
                  }
                  obj = obj.offsetParent;
                }
            } else if(obj.y) {
                curtop += obj.y;
            }
            return curtop;
        };

        // ===========
        // == Array ==
        // ===========
        
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
            var idx = this.indexOf(array, obj);
            if (idx < 0) {
                return;
            }

            this.remove(array, idx);
        };

        // ===================
        // == Sortable Dict ==
        // ===================
        
        this.Dict = function(sort) {
            this._dict = {};
            this._orders = [];
            this._sort = sort;
            if (!!this._sort) {
                var d = this;
                var s = d._sort;
                this._sortWrapper = function(k1, k2) {
                    var v1 = d._dict[k1];
                    var v2 = d._dict[k2];
                    return s(v1, v2);
                };
            }
        };

        this.Dict.prototype.getValue = function(key) {
            return this._dict[key]; 
        };

        this.Dict.prototype.isSorted = function() {
            return !!this._sort;
        };

        this.Dict.prototype.contain = function (key) {
            return (key in this._dict);
        };

        this.Dict.prototype.add = function(key, value) {
            if ( key in this._dict) {
                return;
            }

            this._dict[key] = value;
            if (!!this._sort) {
                this._orders.push(key);
                this._orders.sort(this._sortWrapper);
            }
        };

        // kvs: array. kv[0]: key. kv[1]: value
        this.Dict.prototype.addItems = function(kvs) {
            var i, kv, key, value;
            var count = kvs.length;
            
            for ( i = 0; i < count; i++ ) {
                kv = kvs[i];
                key = kv[0];
                value = kv[1];

                if ( key in this._dict ) {
                    continue;
                }

                this._dict[key] = value;

                if (!!this._sort) {
                    this._orders.push(key);
                }
            }

            if (!!this._sort) {
                this._orders.sort(this._sortWrapper);
            }
        };

        this.Dict.prototype.remove = function(key) {
            if ( key in this._dict ) {
                delete this._dict[key];
                if (!!this._sort) {
                    OC.Array.removeObject(this._orders, key);
                    this._orders.sort(this._sortWrapper);
                }
            }    
        };

        this.Dict.prototype.removeItems = function(keys) {
            if ( typeof keys === "undefined" ) {
                this.removeAll();
            } else {
                var i, key;
                var count = keys.length;
                for ( i = 0; i < count; i++ ) {
                    key = keys[i];
                    if ( key in this._dict ) {
                        delete this._dict[key];
                        if (!!this._sort) {
                            OC.Array.removeObject(this._orders, key);
                        }
                    }
                }
                this._orders.sort(this._sortWrapper);
            }
        };

        this.Dict.prototype.removeAll = function() {
            this._dict = {};
            this._orders.length = 0;
        };

        this.Dict.prototype.iterate = function(callback) {
            var key, value;
            if (!!this._sort) {
                var i;
                var num = this._orders.length;
                for (i = 0; i < num; i++) {
                    key = this._orders[i];
                    value = this._dict[key];
                    callback(key, value);
                }
            } else {
                for ( key in this._dict ) {
                    if (OOPCanvas.Util.hasOwnProperty(this._dict, key)) {
                        value = this._dict[key];
                        callback(key, value);
                    }
                }
            }
        };
                
    }).call(OOPCanvas);

    debug.info("util module is installed.");
};
