

$('#clean-layout').change(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'set', setting: 'clean-layout', value: $('#clean-layout').prop('checked') }, function(response) {

        });
    });
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'get', setting: 'clean-layout' }, function(response) {
        if ( response.setting && response.setting === 'clean-layout' ) {
            $('#clean-layout').prop('checked', response.value);
        }
    });
});