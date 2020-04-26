var app = app || {};

app.tabs = {};
app.tabs.$users = $('#defchat .section .chat-holder .chat-box li a[data-tab=users]');
app.tabs.users  = document.querySelector('#defchat .section .chat-holder .chat-box li a[data-tab=users]' );
app.tabs.$chat  = $('#defchat .section .chat-holder .chat-box li a[data-tab=chat]');
app.tabs.chat   = document.querySelector('#defchat .section .chat-holder .chat-box li a[data-tab=chat]' );
app.tabs.pmWrapper = $('<div>', { id: 'pm-wrapper' }).appendTo($('div.chat-box'));

//app.tabs.$userCount = $('<div>', { id: 'user-count' }).text('USERS (0)').appendTo($('div.chat-box'));

app.tabs.$userCount = $('<span>', { id: 'user-count' }).text('USERS (0)');
app.tabs.$refreshUsersNew = $('<a>', { id: 'refresh-users', href: '#' }).text('(Refresh)');
app.tabs.$userCountWrapper = $('<div>', { id: 'user-count-wrapper' }).append(app.tabs.$userCount).append($('<span>').text(' ')).append(app.tabs.$refreshUsersNew).appendTo($('div.chat-box'));


//app.$usersObect = $('#defchat .section .chat-holder .chat-box li a[data-tab=users]');
//app.usersObject =document.querySelector('#defchat .section .chat-holder .chat-box li a[data-tab=users]' );
app.observeUsers = new MutationObserver(function(mutations) {
    if ( mutations.length > 0 )  {
        app.tabs.$userCount.text(app.tabs.$users.text());
    }

});

app.observePMs = new MutationObserver( function(mutations) {
    if ( mutations.length > 0 ) {

        mutations.forEach((item) => {
            if ( item.addedNodes.length > 0 ) {
                item.addedNodes.forEach((node) => {
                    let n = $(node);
                    if ( n.attr('class') === 'chat-list' ) {
                        let d =n.find('div:first-of-type');
                        if ( ! d.length ) {
                            return;
                        }
                        let regex = /Private conversation with (.+)/
                        let reg = d.text().match(regex);
                        if ( reg && reg.length > 0 ) {
                            console.log( reg[1] );
                            n.attr('data-user', reg[1]);
                        }
                    }
                })
            } else if ( item.type === 'attributes' && item.attributeName === 'style' ) {
                let $target = $(item.target);

                let u = $target.data('user');
                let v = $target.is(':visible');

                if ( u && v ) {
                    app.tabs.pmWrapper.text('PM With: ' + u);
                } else {
                    app.tabs.pmWrapper.text('')
                }
            }
        })
    }
} )


app.tabs.$refreshUsersNew.click(function() {
    document.querySelector("#defchat > div.section > div.chat-holder > div > div.users-list > div:nth-child(1) > a").click();
})



$(document).on('userChange', () => {
    setTimeout(() =>document.querySelector("#defchat > div.section > div.chat-holder > div > div.users-list > div:nth-child(1) > a").click(), 10000);

});


app.observePMs.observe(document.querySelector('.chat-box'), { attributes: true, childList: true, characterData: true, subtree: true });



app.observeUsers.observe(app.tabs.users, { childList: true});
app.tabs.users.click();
app.tabs.chat.click();


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ( ! request.action || !request.setting ) return;
        if ( request.action === 'set' ) {
            if ( ! request.setting )  return;
            if ( request.setting === 'clean-layout' ) {
                $('body').toggleClass('clean-layout', request.value);
            }
        } else if (request.action === 'get' ) {
            if ( request.setting === 'clean-layout' ) {
                sendResponse({setting: 'clean-layout', value: $('body').hasClass('clean-layout') });
            }
        }


    }
)