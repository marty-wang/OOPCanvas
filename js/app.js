$(document).ready(function() {

    var canvas = document.getElementById('oopcanvas');
    var oc = new OC(canvas, {
        'lineWidth': 4,
        'strokeStyle': 'green',
        'fillStyle': 'red'
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
            'rotation': Math.PI/4,
            'fillStyle': 'blue',
            'anchor': 'center'
        });

        oc.drawRect(100, 100, 100, 100, {
            'fillStyle': 'blue',
            'strokeStyle': 'yellow'
        });

        oc.drawEllipse(200, 200, 60, 60, {
            'strokeStyle': 'gray',
            'fillStyle': 'red'
        });
        
        oc.drawEllipse(340, 340, 60, 60);

        oc.drawArc(300, 300, 100, 0, Math.PI, false, {
            'strokeStyle': 'blue'
        });
    });
});
