$(document).ready(function() {

    debug.setLevel(4);

    var canvas = document.getElementById('oopcanvas');
    var oc = OC.create(canvas, {
        'showDebugInfo': true
    });
    oc.startRunloop();

    var width = oc.getWidth();
    var height = oc.getHeight();

    var x = 40;
    var y = 40;
    var w = 200;
    var h = 100;
    var gutter = 20;

    var views = [];
    var view;

    var easings = OC.Animation.easingFunctions;
    var easing;

    for ( easing in easings ) {
        view = oc.easingEquationView(x, y, w, h, easings[easing], easing);

        views.push(view);

        x += ( w + gutter );
        if ( x + w > width ) {
            y += ( h + gutter );
            x = 40;
        } 
    }
       
    $('#draw').click(function() {
        var i;
        var count = views.length;

        for ( i = 0; i < count; i++ ) {
            oc.addChild(views[i]);
        }
    });

    $('#clear').click(function() {
        oc.removeAll();
    });

    $('#stop').click(function() {
        oc.stopRunloop();
    });
});
