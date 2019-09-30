var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.onedrive = (function () {
    $(function () {
        $("button.onedrive").on("click", function () {
            var options = {
                clientId: "2e600adb-3706-4c54-839f-64cf43f79e95",
                action: 'share',
                multiSelect: true,
                success: function (files) {
                    var selected = [];
                    for (var i = 0; i < files.value.length; i++) {
                        selected.push({ url: files.value[i].permissions[0].link.webUrl, title: files.value[i].name, guid: weavyFilebrowser.filebrowser.contentType() })
                    }
                    weavyFilebrowser.helpers.add(selected, 'onedrive')
                },
            };

            OneDrive.open(options);
        });
    })
})();