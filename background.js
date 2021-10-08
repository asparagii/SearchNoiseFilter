// --- background.js ---

importScripts('/common.js')

chrome.runtime.onInstalled.addListener(() => {
    // create context menu to add/remove filters
    chrome.contextMenus.create({
        title: "Toggle noise filter",
        contexts: ['link'],
        id: "toggle-filter",
    });
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
    switch (info.menuItemId) {
        case "toggle-filter":
            // add or remove filters
            getFilters(fs => {
                const matches = getMatchingFilters(info.linkUrl, fs)
                if (matches.length == 0) {
                    addFilter(info.linkUrl)
                } else {
                    removeFilters(matches);
                }
            });
            break;
        default:
        // no op
    }
});

chrome.runtime.onMessage.addListener(
    function (msg, _sender, _sendResponse) {
        switch (msg.type) {
            case "linkcontextmenu":
                // update context menu based on the last hovered link
                check(msg.linkUrl, filtered => {
                    chrome.contextMenus.update("toggle-filter", {
                        title: filtered ? "Noise: remove from filters" : "Noise: add to filters",
                    });
                });
                break;
        }
    }
);
