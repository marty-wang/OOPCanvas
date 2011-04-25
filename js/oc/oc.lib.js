// This is the libaray for generic javascript usage.
// It is independed of OOPCanvas, and will be use
// across all the modules, including the core.

// == Polyfill ==

Array.indexOf = function(array, obj) {
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
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

Array.removeObject = function(array, obj) {
    var idx = Array.indexOf(array, obj);
    if (idx < 0) {
        return;
    }

    Array.remove(idx);
};
