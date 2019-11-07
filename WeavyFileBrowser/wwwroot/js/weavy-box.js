var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.box = (function () {

    var options = {
        clientId: '7d8r9id64e17x70f094qjkfem58rlanc',
        linkType: 'shared'
    };
    var boxSelect = new BoxSelect(options);

    // Register a success callback handler
    boxSelect.success(function (response) {
        var selected = [];
        for (var i = 0; i < response.length; i++) {
            selected.push({ url: response[i].url, title: response[i].name, guid: weavyFilebrowser.filebrowser.contentType() })
        }
        weavyFilebrowser.helpers.add(selected, 'box');

    });
    // Register a cancel callback handler
    boxSelect.cancel(function () {
        console.log("The user clicked cancel or closed the popup");
    });


    $(function () {
        $("button.box").on("click", function () {
            boxSelect.launchPopup();
        })
    });
})();