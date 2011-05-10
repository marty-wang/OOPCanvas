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

    // var button = oc.button(100, 100);
    // button.setZIndex(2);
    // button.click(function(sender, args) {
    //     button.animate({
    //         'left': 400
    //     });
    // });
    // button.bind('mousemove', function(sender, args) {
    //     // debug.debug("mouse move " + button.getId());
    // });
    // button.bind('mouseover', function(sender, args) {
    //     // debug.debug('mouse over ' + button.getId());
    // });

    // button.bind('mouseout', function(sender, args) {
    //     // debug.debug('mouse out ' + button.getId());
    // });

    // button.bind("mousedown", function(sender, args) {
    //     debug.debug("mouse down " + button.getId());
    // });

    // button.bind("mouseup", function(sender, args) {
    //     debug.debug("mouse up " + button.getId());
    // });

    // oc.addChild(button);

    // var button1 = oc.button(125, 125);
    // button1.click(function() {
    //     alert("click " + button1.getId());
    // });
    // button1.bind('mousemove', function(sender, args) {
    //     debug.debug("mouse move " + button1.getId());
    // });
    // button1.bind('mouseover', function(sender, args) {
    //     debug.debug('mouse over ' + button1.getId());
    // });

    // button1.bind('mouseout', function(sender, args) {
    //     debug.debug('mouse out ' + button1.getId());
    // });
    // oc.addChild(button1);

    var rect = oc.rectangle(400, 400, 200, 200);
    rect.config({
        'strokeStyle': 'red',
        'fillStyle': 'blue',
        'cornerRadius': 20
    });
    rect.bind('click', function() {
        alert("hallo");
    });
    oc.addChild(rect);

    var rect1 = oc.rectangle(650, 400, 200, 200);
    rect1.config({
        'strokeStyle': 'red',
        'fillStyle': 'blue'
    });
    oc.addChild(rect1);

    var polygon = oc.polygon(300, 300, 100, 8);
    polygon.config({
        'fillStyle': 'red',
        'strokeStyle': 'green',
        'lineWidth': 8
    });
    polygon.bind('click', function(){
        var sides = polygon.getSides();
        if ( sides === 8 ) {
            polygon.setSides(3);
        } else {
            polygon.setSides(8);
        }
    });
    oc.addChild(polygon);

    var d = "M100,10 L100,10 40,180 190,60 10,60 160,180 z";
    //d = "M50,50 Q-30,100 50,150 100,230 150,150 230,100 150,50 100,-30 50,50";
    //d = "M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80";
    //d = "M10 80 Q 52.5 10, 95 80 T 180 80";
    
    var path = oc.path(50, 50, d);
    path.config({
        'lineWidth': 8,
        'strokeStyle': 'red',
        'fillStyle': 'green'
    });
    path.click(function() {
        alert("hallo, I am a path");
    });
    oc.addChild(path);

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

    $('#stop').click(function() {
        oc.stopRunloop(); 
    });
});
