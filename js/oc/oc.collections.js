//= require "oc.bootstrapper"
//= require "oc.util"

(function(OC) {
   
    /**
     * @namespace
     */
    OC.Collections = {};

    /**
     * @class Sortable Dictionary structure
     */
    OC.Collections.Dict = function Dict (sort) {
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
    
    /** 
     * @exports Dict as OOPCanvas.Collections.Dict
     */
    var Dict = OC.Collections.Dict;
    
    /**
     * return the value for the key.
     */
    Dict.prototype.getValue = function(key) {
        return this._dict[key]; 
    };

    /**
     * return if it is sorted dictionary.
     */
    Dict.prototype.isSorted = function() {
        return !!this._sort;
    };

    /**
     * return if it contains the key
     */
    Dict.prototype.contain = function (key) {
        return (key in this._dict);
    };

    /**
     * add the key-value pair to the dictionary
     */
    Dict.prototype.add = function(key, value) {
        if ( key in this._dict) {
            return;
        }

        this._dict[key] = value;
        if (!!this._sort) {
            this._orders.push(key);
            this._orders.sort(this._sortWrapper);
        }
    };

    /**
     * add an array of key-value pair to the dictionary
     * @param {Array[]} kvs each of the key-value pair is a 2-item array. kv[0]: key. kv[1]: value
     */
    Dict.prototype.addItems = function(kvs) {
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

    /**
     * remove a key-value pair from the dictionary
     */
    Dict.prototype.remove = function(key) {
        if ( key in this._dict ) {
            delete this._dict[key];
            if (!!this._sort) {
                OC.Util.arrayRemoveObject(this._orders, key);
                this._orders.sort(this._sortWrapper);
            }
        }    
    };

    /**
     * remove an array of keys from the dictionary
     */
    Dict.prototype.removeItems = function(keys) {
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
                        OC.Util.arrayRemoveObject(this._orders, key);
                    }
                }
            }
            this._orders.sort(this._sortWrapper);
        }
    };

    /**
     * remove all key-value pairs from the dictionary
     */
    Dict.prototype.removeAll = function() {
        this._dict = {};
        this._orders.length = 0;
    };

    /** iterate the dictionary
     * @param {Function} callback The callback function will have the key and
     * value as the two arguments
     */
    Dict.prototype.iterate = function(callback) {
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

})(OOPCanvas);
