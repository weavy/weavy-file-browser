﻿var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.onedrive = (function () {
    $(function () {
        $("button.onedrive").on("click", function () {
console.log("click");

            var options = {
                clientId: "45ae3579-45ca-42ee-94b0-14a5518865a6",
                action: 'share',
                multiSelect: weavyFilebrowser.filebrowser.multiple,
                success: function (files) {
                    var blobs = [];
                    for (var i = 0; i < files.value.length; i++) {
                        var f = {
                            provider: "onedrive",
                            link: files.value[i].webUrl,
                            name: files.value[i].name,
                            size: files.value[i].size,
                        }

                        if (files.value[i].file) {
                            f.media_type = files.value[i].file.mimeType;
                        }

                        if (files.value[i].image) {
                            f.width = files.value[i].image.width;
                            f.height = files.value[i].image.height;
                        }

                        if (files.value[i]["@microsoft.graph.downloadUrl"]) {
                            f.download = files.value[i]["@microsoft.graph.downloadUrl"];
                        }
                        blobs.push(f);
                    }
                    weavyFilebrowser.helpers.insert(blobs, "onedrive");
                },
            };
            OneDrive.open(options);
        });
    })
})();