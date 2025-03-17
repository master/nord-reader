'use strict';

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        browser.tabs.sendMessage(tabId, { cmd: 'process' });
    }
});
