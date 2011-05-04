$(document).ready(function() {

    debug.setLevel(4);

    var canvas = document.getElementById('oopcanvas');
    var oc = OC.create(canvas, {
        'showDebugInfo': true
    });
    oc.startRunloop();

    var bg = oc.background({
        'strokeStyle': 'transparent',
        'fillStyle': '#C6C8CA'
    });

    oc.addChild(bg);

    var button = oc.button(100, 100);
    oc.addChild(button);

    var width = oc.getWidth();
    var height = oc.getHeight();

    // var x = 40;
    // var y = 40;
    // var w = 200;
    // var h = 100;
    // var gutter = 20;

    // var views = [];
    // var view;

    // var easings = OC.Animation.easingFunctions;
    // var easing;

    // for ( easing in easings ) {
    //     view = oc.easingEquationView(x, y, w, h, easings[easing], easing);

    //     views.push(view);

    //     x += ( w + gutter );
    //     if ( x + w > width ) {
    //         y += ( h + gutter );
    //         x = 40;
    //     } 
    // }
    //    
    // $('#draw').click(function() {
    //     oc.addChildren(views);
    //     oc.addChild(bg);
    // });

    // $('#clear').click(function() {
    //     oc.removeAll();
    // });

    // $('#stop').click(function() {
    //     oc.clear(40, 40, 40, 40); 
    // });
});
