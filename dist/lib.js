/*!
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 * 
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */
window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})();
/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };
})();
/*!
 *
 *   The contents of this file were written by Kevin Lindsey
 *   copyright 2002-2003 Kevin Lindsey
 *
 *   This file was compacted by jscompact
 *   A Perl utility written by Kevin Lindsey (kevin@kevlindev.com)
 *
 */
Svg.VERSION=1.0;
Svg.NAMESPACE="http://www.w3.org/2000/svg";
function Svg(){}
PathParser.PARAMCOUNT={A:7,C:6,H:1,L:2,M:2,Q:4,S:4,T:2,V:1,Z:0};
PathParser.METHODNAME={A:"arcAbs",a:"arcRel",C:"curvetoCubicAbs",c:"curvetoCubicRel",H:"linetoHorizontalAbs",h:"linetoHorizontalRel",L:"linetoAbs",l:"linetoRel",M:"movetoAbs",m:"movetoRel",Q:"curvetoQuadraticAbs",q:"curvetoQuadraticRel",S:"curvetoCubicSmoothAbs",s:"curvetoCubicSmoothRel",T:"curvetoQuadraticSmoothAbs",t:"curvetoQuadraticSmoothRel",V:"linetoVerticalAbs",v:"linetoVerticalRel",Z:"closePath",z:"closePath"}
function PathParser(){this._lexer=new PathLexer();this._handler=null;}
PathParser.prototype.parsePath=function(path){if(path==null||path.namespaceURI!=Svg.NAMESPACE||path.localName!="path")throw new Error("PathParser.parsePath: The first parameter must be an SVG path element");this.parseData(path.getAttributeNS(null,"d"));};
PathParser.prototype.parseData=function(pathData){if(typeof(pathData)!="string")throw new Error("PathParser.parseData: The first parameter must be a string");if(this._handler!=null&&this._handler.beginParse!=null)this._handler.beginParse();var lexer=this._lexer;lexer.setPathData(pathData);var mode="BOP";var token=lexer.getNextToken();while(!token.typeis(PathToken.EOD)){var param_count;var params=new Array();switch(token.type){case PathToken.COMMAND:if(mode=="BOP"&&token.text!="M"&&token.text!="m")throw new Error("PathParser.parseData: a path must begin with a moveto command");mode=token.text;param_count=PathParser.PARAMCOUNT[token.text.toUpperCase()];token=lexer.getNextToken();break;case PathToken.NUMBER:break;default:throw new Error("PathParser.parseData: unrecognized token type: "+token.type);}for(var i=0;i<param_count;i++){switch(token.type){case PathToken.COMMAND:throw new Error("PathParser.parseData: parameter must be a number: "+token.text);case PathToken.NUMBER:params[i]=token.text-0;break;default:throw new Errot("PathParser.parseData: unrecognized token type: "+token.type);}token=lexer.getNextToken();}if(this._handler!=null){var handler=this._handler;var method=PathParser.METHODNAME[mode];if(handler[method]!=null)handler[method].apply(handler,params);}if(mode=="M")mode="L";if(mode=="m")mode="l";}};
PathParser.prototype.setHandler=function(handler){this._handler=handler;};
PathLexer.VERSION=1.0;
function PathLexer(pathData){if(pathData==null)pathData="";this.setPathData(pathData);}
PathLexer.prototype.setPathData=function(pathData){if(typeof(pathData)!="string")throw new Error("PathLexer.setPathData: The first parameter must be a string");this._pathData=pathData;};
PathLexer.prototype.getNextToken=function(){var result=null;var d=this._pathData;while(result==null){if(d==null||d==""){result=new PathToken(PathToken.EOD,"");}else if(d.match(/^([ \t\r\n,]+)/)){d=d.substr(RegExp.$1.length);}else if(d.match(/^([AaCcHhLlMmQqSsTtVvZz])/)){result=new PathToken(PathToken.COMMAND,RegExp.$1);d=d.substr(RegExp.$1.length);}else if(d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)){result=new PathToken(PathToken.NUMBER,parseFloat(RegExp.$1));d=d.substr(RegExp.$1.length);}else{throw new Error("PathLexer.getNextToken: unrecognized path data "+d);}}this._pathData=d;return result;};
PathToken.UNDEFINED=0;
PathToken.COMMAND=1;
PathToken.NUMBER=2;
PathToken.EOD=3;
function PathToken(type,text){if(arguments.length>0){this.init(type,text);}}
PathToken.prototype.init=function(type,text){this.type=type;this.text=text;};
PathToken.prototype.typeis=function(type){return this.type==type;}
