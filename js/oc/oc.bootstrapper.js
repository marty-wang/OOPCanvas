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

//= require "../lib/ba-debug.min"

var OOPCanvas = (function(window, document, undefined) {
    
    debug.setLevel(0);
    
    OOPCanvas.meta = {
        'version': '0.0.0',
        'author': 'Mo Wang',
        'repo': 'git@github.com:marty-wang/OOPCanvas.git',
        'license': 'MIT'
    };

    // bootstrapper constructor
    function OOPCanvas () {}

    OOPCanvas.prototype.initModules = function() {
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
    
    OOPCanvas.modules = {};
    OOPCanvas._inits = [];
    OOPCanvas.isModulesInstalled = false;

    OOPCanvas.installModules = function (moduleSettings) {
        if (OOPCanvas.isModulesInstalled) {
            return;
        }
        debug.info("=== Start to Install Modules ===");

        moduleSettings = moduleSettings || {};
        _iterateModules(OOPCanvas.modules, function(m, mk) {
            _installModule(m, moduleSettings[mk]);
        });
        OOPCanvas.isModulesInstalled = true;
        
        debug.info("=== Completed Modules Installation ===");
    };
  
    OOPCanvas.installPlugin = function(namespace, creator) {
        var fn = OOPCanvas.prototype;

        fn[namespace] = function() {
            if (!!creator) {
                return creator.apply(this, arguments);
            }
        };
    };
    
    // == Private ==

    function _iterateModules (modules, callback) {
        var mk, module;
        for (mk in modules) {
            if (Object.prototype.hasOwnProperty.call(modules, mk)) {
                module = modules[mk];
                if (typeof module === "function") {
                    callback(module, mk);
                } else if (typeof module === "object") {
                    _iterateModules(module, callback);
                }
            }
        }
    }

    function _installModule (module, setting) {
        module(OOPCanvas, setting);
        if (!!module.init) {
            OOPCanvas._inits.push(module.init);
        }
    } 
        
    return OOPCanvas;

})(window, document);

'OC' in window || (window.OC = OOPCanvas);

