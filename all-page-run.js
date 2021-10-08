// --- all-page-run.js ---
// This script gets injected in all pages

/**
* initContextMenu adds a listener to all links in the current page.  This
* listener will send a request to update the context menu to the extension
* worker. This way the content of the context menu gets updated before
* rendering it.  There's apparently no other way to do this, which is kinda
* weird. https://bugs.chromium.org/p/chromium/issues/detail?id=60758
*/
function initContextMenu(){
    const anchors = document.querySelectorAll("a");
    anchors.forEach(n => {
        n.addEventListener("mouseover", () => {
            chrome.runtime.sendMessage({
                type: "linkcontextmenu",
                linkUrl: n.href,
            });
        });
    });

}

document.addEventListener("InitContextMenuUpdate", initContextMenu);
document.dispatchEvent(new CustomEvent("InitContextMenuUpdate"));
