
/**
 * @param { (fs: string[]) => void? } callback
 */
function getFilters(callback) {
    chrome.storage.sync.get('filter-list', (data) => {
        if (data['filter-list']) {
            callback && callback(data['filter-list']);
        } else {
            callback && callback([]);
        }
    });
}

/**
 * @param { string } href
 * @param { () => void? } callback
 */
function addFilter(href, callback) {
    try {
        const url = new URL(href);
        const f = '=' + url.hostname;
        chrome.storage.sync.get('filter-list', (data) => {
            let filters = data['filter-list'];
            if (!filters) {
                filters = [f];
            } else {
                filters.push(f);
            }
            chrome.storage.sync.set({'filter-list': filters}, callback);
        });
    } catch (e) {
        console.error(e);
        callback && callback();
    }
}

/**
 * @param { string[] } filters
 * @param { () => unknown? } callback
 */
function setFilters(filters, callback) {
    chrome.storage.sync.set({'filter-list': filters}, callback);
}

/**
 * @param { string } url
 * @param { string } filter
 */
function checkFilter(url, filter) {
    if (filter.startsWith('#')) {
        // ignore comments
        return false;
    } else if (filter.startsWith('=')) {
        return (new URL(url)).hostname.includes(filter.slice(1));
    } else if (filter.startsWith('~')) {
        const re = new RegExp(filter.slice(1), "gi");
        return re.test(url);
    }
}

/**
 * @param { string } url
 * @param { (filtered: boolean) => unknown } callback
 */
function check(url, callback) {
    getFilters(fs => {
        let filtered = false;
        for(const f of fs){
            if(checkFilter(url, f)){
                filtered = true;
                break;
            }
        }
        callback(filtered);
    });
}

/**
 * @param { string[] } filters
 * @param { () => unknown? } callback
 */
function removeFilters(filters, callback) {
    getFilters(fs => {
        for (const filter of filters) {
            const index = fs.indexOf(filter);
            if (index != -1) {
                fs.splice(index, 1);
            }
        }
        setFilters(fs, callback);
    })
}

/**
 * @param { string } url
 * @param { string[] } filters
 * @return { string[] } all filters in `filters` matching `url`
 */
function getMatchingFilters(url, filters) {
    const matchingFilters = [];
    for (const filter of filters) {
        if (checkFilter(url, filter)) {
            matchingFilters.push(filter);
        }
    }
    return matchingFilters;
}

/**
 * @param { string } url
 * @param { () => unknown? } callback
 */
function removeMatchingFilters(url, callback) {
    getFilters(fs => {
        const matches = getMatchingFilters(url, fs);
        removeFilters(matches, callback);
    });
}

