// send the page title as a chrome message
chrome.runtime.sendMessage(document.title);
console.log('Chaturbate Payload Injected...');

var app = {};

/* Select the users name from the header, and use that as the room name */
app.room = $('.user_information_header_username').text();

/** Observes the chat list for changes then sends them to the server to be processes */
app.observer = new MutationObserver(function(mutations) {
    // fired when a mutation occurs
    if (mutations.length > 0) {
        /** Loop through the chatlist changes */
        mutations.forEach(function(item) {
            /** Ensure that a node was added to the chat-list childlist */
            if ( item.type === 'childList' && item.addedNodes.length > 0 ) {
                /** Loop through the added children (There should only ever be one) */
                item.addedNodes.forEach(function(value) {
                    /** Clone the value so we can modify it without effecting the chat */
                    let $item = $(value).clone();

                    /** Extract the username */
                    let $username = $item.find('span.username');
                    if ($username.length < 1) return false;

                    /** Get the tip message if there is one */
                    let $tipStr = $item.find('.emoticonImage');

                    /** Get the user's name and remove the colon at the end */
                    let user    = $username.text().replace(/:$/g, '');

                    /** Get the user Type */
                    let userType = $username.attr('class');
                     userType = userType.replace(/username|messagelabel/g, '').trim();

                    /** Strip the username so we can read the message */
                    $username.remove();

                    /** Data to send to the API */
                    let data = {
                        action: 'message',
                        room: app.room,
                        user: user,
                        tip: false,
                        message: false,
                        userType: userType
                    };


                    if  ($tipStr.length < 1 && false) {
                        data.message = $item.text();
                    } else {
                        /** If the tip string exists, extract the tip from it */
                        let message = $tipStr.text();
                        let regex = /tipped (\d+) tokens( -- )?(.*)?/;
                        let reg = message.match(regex);
                        if ( reg && reg.length > 1 ) {
                            data.tip = reg[1];
                            data.action = 'tip';
                            if ( reg.length > 2 ) {
                                data.message = reg[3];
                            }
                        }
                    }
                    /** TODO: Add User join / leave extraction */

                    /** If there is a message or tip, send it to the background to be send to the API */
                    if (  data.tip || data.message ) {
                        chrome.runtime.sendMessage(data);
                    }
                    return true;
                })
            }
        })
    }
});





/** Wait a second before observing, to avoid sending duplicate tips on page refresh */
setTimeout(function(){
    app.observer.observe(document.querySelector('.chat-list'), {childList: true});
    console.log('Chaturbate Payload Listening...');
}, 1000);

