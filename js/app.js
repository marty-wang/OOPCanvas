$(document).ready(function() {


    //  level - (Number) If 0, disables logging. If negative, shows N lowest
    //    priority levels of log messages. If positive, shows N highest priority
    //    levels of log messages.
    //
    //  Priority levels:
    // 
    //   log (1) < debug (2) < info (3) < warn (4) < error (5)

    debug.setLevel(4);

    OC.installModules();

    var canvas = document.getElementById('oopcanvas');
    var oc = OC.create(canvas, {
        'lineWidth':            4,
        'strokeStyle':          'green',
        'fillStyle':            'red',
        'useOptimizedRunloop':  false,
        'fps':                  60,
        'showDebugInfo':        true,
        'useBackBuffer':        true
    });

    var canvas1 = document.getElementById('oopcanvas1');
    var oc1 = OC.create(canvas1, {
        'lineWidth':            4,
        'strokeStyle':          'green',
        'fillStyle':            'red',
        'useOptimizedRunloop':  true,
        'fps':                  20, // no effect
        'showDebugInfo':        true
    });
        
    $('#start-button').click(function(evt) {
        oc.startRunloop();
    
        var rect = oc.rectangle(50, 50, 100, 100);
        rect.setZIndex(10);
        oc.addChild(rect);

        rect.animate({
            'left': 200,
            'top': 200,
            'width': 10,
            'height': 10
        }, 1000, 'easeInOutQuad');
// 
//         var rect1 = oc.rectangle(80, 80, 100, 100, {
//             'fillStyle': 'blue'
//         });
//         oc.addChild(rect1);

        // oc1.startRunloop();
        // var rect2 = oc1.rectangle(80, 80, 60, 60, {
        //     'fillStyle': 'yellow',
        //     'strokeStyle': 'gray'
        // });
        // oc1.addChild(rect2);
    });

    $('#stop-button').click(function(evt) {
        oc.stopRunloop();
        oc1.stopRunloop();
    });

    $('#clear-button').click(function(evt) {
        oc.clearAll();
    });

    // var width = oc.getWidth();
    // var height = oc.getHeight();
    // var gutter = 20; // px

    // var num_width = width / gutter;
    // var num_height = height / gutter;
    // var i;
    // var x, y, x1, y1;

    // $('#draw-button').click(function(evt) {
    //     for (i = 0; i <= num_width; i++) {
    //         x = i * gutter;
    //         y = 0;
    //         x1 = x;
    //         y1 = y + height;
    //       
    //         oc.drawLine(x, y, x1, y1);
    //     }

    //     for (i = 0; i <= num_height; i++) {
    //         y = i * gutter;
    //         x = 0;
    //         y1 = y;
    //         x1 = x + width;
    //       
    //         oc.drawLine(x, y, x1, y1);
    //     }
    //     
    //     oc.createRect(100, 100, 100, 100, {
    //         'rotation': Math.PI/4,
    //         'fillStyle': 'blue',
    //         'anchor': 'center'
    //     });
    //     
    //     oc.createRect(100, 100, 100, 100, {
    //         'fillStyle': 'blue',
    //         'strokeStyle': 'yellow'
    //     });

    //     oc.drawEllipse(200, 200, 120, 60, {
    //         'strokeStyle': 'gray',
    //         'fillStyle': 'red'
    //     });
    //     
    //     oc.drawEllipse(340, 340, 60, 60);

    //     oc.drawArc(300, 300, 100, 0, Math.PI, false, {
    //         'strokeStyle': 'blue'
    //     });
    // });
});
