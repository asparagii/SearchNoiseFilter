
/**
 * @param { Array<string> } filterlist
 */
function serialize(filterlist) {
    return filterlist.join("\n");
}

/**
 * @param { string } data
 */
function deserialize(data) {
    return data.split('\n');
}

/**
 * @param { CallableFunction? } cb
 */
function load(cb) {
    const input = document.getElementById("filterbody")
    input.setAttribute("disabled", true);

    chrome.storage.sync.get(
        "filter-list",
        data => {
            input.value = serialize(data['filter-list']);
            input.removeAttribute("disabled");
            if (cb) cb();
        }
    );
}

function reload() {
    load();
}

function save() {
    const input = document.getElementById("filterbody");
    input.setAttribute("disabled", true);
    chrome.storage.sync.set(
        {"filter-list": deserialize(input.value)},
        () => {
            input.removeAttribute("disabled");
        },
    );
}

function init() {
    document.getElementById("save").onclick = save;
    document.getElementById("reload").onclick = reload;
    load();
}

document.addEventListener("DOMContentLoaded", init);
