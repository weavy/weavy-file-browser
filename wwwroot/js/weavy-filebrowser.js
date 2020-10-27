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
            // trigger click on specified provider button to open up picker
            guid = e.data.guid || "";
            multiple = e.data.multiple;            
            $("button." + e.data.provider).trigger("click");
        } else if (e.data.name === "create") {
            // trigger click on Google Drive Create button
            weavyFilebrowser.google.create(e.data.title, e.data.type, e.data.guid);
        }
    });

    return {
        contentType: getContentType,
        multiple: isMultiple
    }
})();