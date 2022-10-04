var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.box = (function () {

    document.addEventListener("click", weavyFilebrowser.helpers.delegate("button.box, a.box", function() { 
        var options = {
            clientId: "7d8r9id64e17x70f094qjkfem58rlanc",
            linkType: "shared",
            multiselect: weavyFilebrowser.filebrowser.multiple()
        };

        var boxSelect = new BoxSelect(options);

        // register a success callback handler
        boxSelect.success(function (files) {
            var blobs = [];
            for (var i = 0; i < files.length; i++) {
                var f = {
                    provider: "Box",
                    link: files[i].url,
                    name: files[i].name,
                    size: files[i].size || 0,
                    raw: files[i]
                }
                blobs.push(f);
            }
            weavyFilebrowser.helpers.insert(blobs, "box");
        });

        // register a cancel callback handler
        boxSelect.cancel(function () {
            console.log("The user clicked cancel or closed the popup");
        });

        boxSelect.launchPopup();
    }));
})();