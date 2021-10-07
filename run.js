
let filters = [];
const getFilters = (cb) => {
    chrome.storage.sync.get('filter-list', (data) => {
        if (data['filter-list']) {
            filters = data['filter-list'];
        } else {
            setFilters();
        }
        cb();
    });
}

let setFilters = () => {
    chrome.storage.sync.set({'filter-list': filters});
}

let addFilter = (filter) => {
    filters.push(filter);
    applyStyle();
    setFilters();
}

let removeFilter = (filter) => {
    const index = filters.indexOf(filter);
    if (index != -1) {
        filters.splice(index, 1);
        applyStyle();
        setFilters();
    }
}

/**
 * @param { HTMLAnchorElement } node
 * @param { string } filter
 */
function checkFilter(node, filter) {
    if (filter.startsWith('#')) {
        // ignore comments
        return false;
    } else if (filter.startsWith('=')) {
        return node.hostname.includes(filter.slice(1));
    } else if (filter.startsWith('~')) {
        const re = new RegExp(filter.slice(1), "gi");
        return re.test(node.href);
    }
}

let applyStyle = () => {
    const links = document.querySelectorAll(
        "div#search .g > div > div > div > a"
    );
    links.forEach(node => {
        let filtered = false;
        for (filter of filters) {
            if (checkFilter(node, filter)) {
                filtered = true;
                break;
            }
        }

        if (filtered) {
            node.parentNode.parentNode.classList.add("extra-search-red");
        } else {
            node.parentNode.parentNode.classList.remove("extra-search-red");
        }

        if (!filtered) {
            let btn = node.parentNode.querySelector(".extra-search-add-filter");
            if (!btn) {
                const addFilterBtn = document.createElement("div");
                addFilterBtn.classList.add("extra-search-add-filter");
                node.parentNode.appendChild(addFilterBtn);
                btn = addFilterBtn;
            }

            btn.innerHTML = "ADD FILTER";
            btn.onclick = () => {addFilter('=' + node.hostname)};
        }
    });
}

const init = () => {
    getFilters(applyStyle);
}

document.addEventListener("PageReadyCustomEv", init);
document.dispatchEvent(new CustomEvent('PageReadyCustomEv'));
