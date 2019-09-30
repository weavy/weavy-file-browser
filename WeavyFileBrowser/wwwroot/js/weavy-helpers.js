var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.helpers = (function () {
    var addLinks = function (links, provider, open) {
        window.parent.postMessage({ name: "insert", links: links, provider: provider, open: open || false }, "*");
    }

    var close = function () {
        window.parent.postMessage({ name: "closePicker" }, "*");

    }

    return {
        add: addLinks,
        close: close
    }
})();