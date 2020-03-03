var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.helpers = (function () {
    var addLinks = function (links, provider, open) {
        window.parent.postMessage({ name: "insert", links: links, provider: provider, open: open || false }, "*");
    }

    var close = function () {
        window.parent.postMessage({ name: "closePicker" }, "*");

    }

    var postMessage = function (name) {
        window.parent.postMessage({ name: name }, "*");
    }

    if (window.self !== window.top) {
        $(".button-container").css("display", "none");
    }

    return {
        add: addLinks,
        close: close,
        post: postMessage
    }
})();