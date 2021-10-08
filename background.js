
importScripts('/common.js')

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Toggle noise filter",
        contexts: ['link'],
        id: "toggle-filter",
    });
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
    switch (info.menuItemId) {
        case "toggle-filter":
            getFilters(fs => {
                const matches = getMatchingFilters(info.linkUrl, fs)
                if(matches.length == 0){
                    addFilter(info.linkUrl)
                } else {
                    removeFilters(matches);
                }
            });
            (info.linkUrl);
            break;
        default:
        // no op
    }
});

