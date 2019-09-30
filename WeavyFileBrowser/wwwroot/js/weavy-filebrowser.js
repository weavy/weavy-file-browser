var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.filebrowser = (function () {

    var guid = null;

    var getContentType = function () {
        return guid;
    }

    // Listen to incomming messages
    //--------------------------------------------------------------
    window.addEventListener("message", function (e) {
        if (e.data.name === "open") {
            // trigger click on specified provider button to open up picker
            guid = e.data.guid;
            $("button." + e.data.provider).trigger("click");
        } else if (e.data.name === "create") {
            // trigger click on Google Drive Create button
            weavyFilebrowser.google.create(e.data.title, e.data.type, e.data.guid);
        }
    });

    return {
        contentType: getContentType
    }
})();