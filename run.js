let applyStyle = (filters) => {
    const links = document.querySelectorAll(
        "div#search .g > div > div > div > a"
    );
    links.forEach(node => {
        let filtered = false;
        for (filter of filters) {
            if (checkFilter(node.href, filter)) {
                filtered = true;
                break;
            }
        }

        if (filtered) {
            node.parentNode.parentNode.classList.add("extra-search-red");
        } else {
            node.parentNode.parentNode.classList.remove("extra-search-red");
        }
    });
}

const init = () => {
    getFilters(applyStyle);
}

document.addEventListener("PageReadyCustomEv", init);
chrome.storage.onChanged.addListener((changes, area) => {
    if(area != 'sync') return;
    if(changes['filter-list']){
        getFilters(applyStyle);
    }
});
document.dispatchEvent(new CustomEvent('PageReadyCustomEv'));
