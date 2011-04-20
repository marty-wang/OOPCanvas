$(document).ready(function() {

    var canvas = document.getElementById('oopcanvas');
    var oc = new OC(canvas, {
        'lineWidth': 4,
        'strokeStyle': 'green'
    });
    
    var width = canvas.getAttribute('width');
    var height = canvas.getAttribute('height');
    var gutter = 20; // px

    var num_width = width / gutter;
    var num_height = height / gutter;
    var i;
    var x, y, x1, y1;

    $('#draw-button').click(function(evt) {
        for (i = 0; i <= num_width; i++) {
            x = i * gutter;
            y = 0;
            x1 = x;
            y1 = y + height;
          
            oc.drawLine(x, y, x1, y1);
        }

        for (i = 0; i <= num_height; i++) {
            y = i * gutter;
            x = 0;
            y1 = y;
            x1 = x + width;
          
            oc.drawLine(x, y, x1, y1);
        }
        
        oc.drawRect(100, 100, 100, 100, {
            'fillStyle': 'red'
        });
        
        oc.drawRect(100, 100, 100, 100, {
            'rotation': Math.PI/4,
            'fillStyle': 'blue'
        });
    });
});
