var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.filebrowser = (function () {

    var guid = null;
    
    // NOTE: legacy pickers allow multiselect
    var multiple = true;

    var getContentType = function () {
        return guid;
    }

    var isMultiple = function () {
        return multiple;
    }

    // Listen to incomming messages
    //--------------------------------------------------------------
    window.addEventListener("message", function (e) {
        if (e.data.name === "open") {
            // trigger click on specified provider button to open picker
            guid = e.data.guid || "";
            if (typeof(e.data.multiple) != "undefined" && e.data.multiple != null) {
                multiple = e.data.multiple;
            }
            $("button." + e.data.provider).trigger("click");
        } else if (e.data.name === "create") {
            // trigger click on Google Drive Create button
            guid = e.data.guid || "";
            weavyFilebrowser.google.create(e.data.title, e.data.type, e.data.guid);
        }
    });

    return {
        contentType: getContentType,
        multiple: isMultiple
    }
})();