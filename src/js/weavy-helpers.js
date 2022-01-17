﻿var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.helpers = (function () {

    var LEGACY = "legacy";

    var insert = function (blobs, provider, open) {
        if (weavyFilebrowser.helpers.version === LEGACY) {
            var legacyFormat = [];

            for (var i = 0; i < blobs.length; i++) {
                legacyFormat.push({ url: blobs[i].link, title: blobs[i].name, guid: weavyFilebrowser.filebrowser.contentType() });
            }
            window.parent.postMessage({ name: "insert", weavyId: weavyFilebrowser.helpers.weavyId, links: legacyFormat, provider: provider, open: open || false }, "*");
        } else {
            window.parent.postMessage({ name: "addExternalBlobs", weavyId: weavyFilebrowser.helpers.weavyId, blobs: blobs, open: open || false }, "*");
        }
    }

    var close = function () {
        window.parent.postMessage({ name: "closePicker", weavyId: weavyFilebrowser.helpers.weavyId}, "*");
    }

    var postMessage = function (name) { 
        window.parent.postMessage({ name: name, weavyId: weavyFilebrowser.helpers.weavyId }, "*");
    }

    if (inIframe()) {
        $("html").addClass("framed");
        $(".button-container").css("display", "none");
    }

    var getParameter = function (name) {
        return getParameterByName(name);
    }

    function getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    return {
        insert: insert,
        close: close,
        post: postMessage,
        getParameter: getParameter,

        // parameters
        origin: getParameterByName("origin"),
        weavyId: getParameterByName("weavyId"),
        version: getParameterByName("v") || LEGACY,
    }
})();