$(document).ready(function() {

    debug.setLevel(4);

    OC.installModules();

    var canvas = document.getElementById('oopcanvas');
    var oc = OC.create(canvas, {
        'strokeStyle': 'green',
        'showDebugInfo': true
    });
    oc.startRunloop();

    var size = oc.getSize();
    var width = size.width;
    var height = size.height;

    var fromLeft = 20;
    var toLeft = 700;
    var duration = 1000;

    var gutter = 30;
    var top = 20;

    var samples = {};
    var easings = OC.Animator.easingFunctions;
    var easing;

    for ( easing in easings ) {
        samples[easing] = top;
        top += gutter;
    }

    var rects = {};

    var sample;
    var rect;
    
    for (sample in samples) {
        (function(sample){
            rect = oc.rectangle(fromLeft, samples[sample], 20, 20);
            rect.bind("mouseover", function() {
                oc.changeCursor('pointer');
                $('#'+sample).addClass('current');
            });
            rect.bind("mouseout", function() {
                oc.changeCursor('default');
                $('#'+sample).removeClass('current');
            });
            rect.bind('click', function(sender) {
                var rect = sender;
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
            oc.addChild(rect);
            rects[sample] = rect;
        })(sample);
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

        html += '<a href="" class="action" id="'+ sample +'">' + sample + '</a>';
        count ++;
        if ( count % 3 === 0) {
            html += '</li><li>';
        }
    }

    $('ul.actions').append(html);

    for (sample in samples) {
        (function(sample){
            $('#'+sample).click(function(evt) {
                evt.preventDefault();

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
