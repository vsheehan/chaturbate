/**
 * Listen for messages from the payload.js
 */
chrome.runtime.onMessage.addListener(
    function(message) {
        /** If the message has an action send it to the api for processing... */
        if ( message && message.action ) {
            /** Update with current api location... */
            $.post( 'https://dev.techdisorder.com/chaturbate/api.php', message )
                .fail(function(err, type, msg) {
                    alert( "error: " + msg );
                });
        }

    }
);
