/*!
 * OOPCanvas JavaScript Library
 * http://marty_wang.no.de/
 * Licensed under the MIT license.
 *
 * Copyright (C) 2011 by Mo Wang
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Dependencies: <a href="http://benalman.com/projects/javascript-debug-console-log/">JavaScript Debug</a>, <a href="http://www.broofa.com/2008/09/javascript-uuid-function/">Math.uuid.js</a>, <a href="http://www.kevlindev.com/dom/path_parser/index.htm">Path Parser</a>
 * @class
 * @exports OC as OOPCanvas
 */
var OOPCanvas = (function() {
    
    debug.setLevel(0);
    
    /**
     * @static
     */
    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'git@github.com:marty-wang/OOPCanvas.git',
        'license': 'MIT'
    };

    /**
     * @private
     * @constructor
     */
    function OOPCanvas () {}

    
    /**
     * @private
     */
    OOPCanvas._inits = [];
  
    /**
     * Plugins should be installed via this method
     * @param {String} namespace
     * @param {Function} plugin
     */
    OOPCanvas.installPlugin = function(namespace, plugin) {
        var fn = OOPCanvas.prototype;

        fn[namespace] = function() {
            if (!!plugin) {
                return plugin.apply(this, arguments);
            }
        };
    };

    /**
     * @static
     */
    OOPCanvas.initialize = function(init) {
        OOPCanvas._inits.push(init);
    };

    
    OOPCanvas.prototype._initModules = function() {
        debug.info("+++ Start to Init Modules +++");
        var oc = this;
        var i, init;
        var inits = OOPCanvas._inits;
        var count = inits.length;

        for (i = 0; i < count; i++) {
            init = inits[i];
            init(oc);
        }
        debug.info("+++ Completed Modules Init +++");
    };
        
    return OOPCanvas;

})();

'OC' in window || (window.OC = OOPCanvas);

