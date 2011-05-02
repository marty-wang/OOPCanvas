$(document).ready(function() {

    debug.setLevel(4);

    OC.installModules();

    var canvas = document.getElementById('oopcanvas');
    var oc = OC.create(canvas, {
        'strokeStyle': 'green',
        'showDebugInfo': true
    });
    oc.startRunloop();

    var width = oc.getWidth();
    var height = oc.getHeight();

    var fromLeft = 20;
    var toLeft = 700;
    var duration = 1000;

    var gutter = 30;
    var top = 20;

    var samples = {};
    var easings = OC.Animation.easingFunctions;
    var easing;

    for ( easing in easings ) {
        samples[easing] = top;
        top += gutter;
    }

    var rects = {};

    var sample;
    var rect;
    for (sample in samples) {
        rect = oc.rectangle(fromLeft, samples[sample], 20, 20);
        oc.addChild(rect);
        rects[sample] = rect;
    }
    
    $('#reset').click(function() {
        for (sample in rects) {
            rect = rects[sample];
            rect.setPosition(fromLeft, samples[sample]);
        }
    });

    $('#all').click(function() {
        for (sample in rects) {
            rect = rects[sample];
            rect.animate({
                'left': toLeft
            }, {
                'duration': duration,
                'easingFunction': sample
            });
        }
    });
    
    var count = 0;
    var html = "<li>";
    for ( sample in samples ) {
        if (sample === "linear") {
            continue;
        }

        html += '<button id="'+ sample +'">' + sample + '</button>';
        count ++;
        if ( count % 3 === 0) {
            html += '</li><li>';
        }
    }

    $('ul.actions').append(html);

    for (sample in samples) {
        (function(sample){
            $('button#'+sample).click(function() {
                rect = rects[sample];
                rect.animate({
                    'left': toLeft
                }, {
                    'duration': duration,
                    'easingFunction': sample,
                    'callbacks': {
                        'start': function(startValues) {
                            debug.debug(sample + " animation is started");
                        },
                        'animating': function(currentValues) {
                            debug.debug(sample + " animation is animating");
                        },
                        'complete': function(endValues) {
                            debug.debug(sample + " animation is completed");
                        }
                    }
                });
            });
        })(sample);
    }
});
