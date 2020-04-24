


var app = {};
/** The Main Div */
app.screen = $('#screen');

/** Heart Container */
app.bounceBox = $('#bounce-box');

/** The room name aka chaturbate username */
app.room = $('#room').val();

/** Gets a random Y-axis starting position for the heart */
app.getRand = function() {
    let num = Math.floor(Math.random()*205) + 1;
    if ( num <= 30 ) {
        num *= -1;
    } else {
        num -= 30;
    }
    return num;
};

/** Sways the heart back and forth across the bounce box */
app.sway = function( element ) {
    let left = element.position().left;
    let num;
    if ( left === -30 ) {
        num = 175;
    } else if (left === 175) {
        num = -30;
    } else {
        num = Math.floor(Math.random()*2) === 1 ? -30 : 175;
    }

    element.animate({left: num}, {
        duration: 3000,
        queue: false,
        complete:function() {
            app.sway(element);
        }
    })
};

/** Adds and animates the heart to the bounce box. */
app.addTip = function(user, tip) {
    let heart = $('<div>', {class:'tip-wrapper'})
        .append($('<div>', {class: 'heart'}).append($('<div>', {class:'tip'}).text(tip)))
        .append( $('<div>', {class:'username'}).text(user) );
    heart.css({bottom: '-75px', left: app.getRand() + 'px' });
    app.bounceBox.append(heart);
    heart.animate({
        bottom: '768px'
    }, {
        duration: 5000,
        queue: false,
        complete: function() {
            heart.remove();
        }
    } );
    app.sway(heart);
};

/** AJAX request the data from the api, and convert it into hearts */
app.query = function() {
    $.post('https://dev.techdisorder.com/chaturbate/api.php', { action: 'get', room: app.room }, function( data ){
        if ( data.length ) {
            data.forEach(function(tip) {
                app.addTip( tip.user, tip.tip );
            } );

        }
    });

};

/** Check for new tips once per second */
setInterval(() => app.query(), 1000);


/** Testing Purposes only */
$('#test-tip').click(function() {
    app.addTip('TestUser', 1000 )
});