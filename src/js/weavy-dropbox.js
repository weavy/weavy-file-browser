var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.dropbox = (function () {
    $(function () {
        $("button.dropbox,a.dropbox").on("click", function () {
            var options = {
                multiselect: weavyFilebrowser.filebrowser.multiple(),
                success: function (files) {
                    var blobs = [];

                    for (var i = 0; i < files.length; i++) {
                        var f = {
                            provider: "Dropbox",
                            link: files[i].link,
                            name: files[i].name,
                            size: files[i].bytes,
                            raw: files[i]
                        }

                        if (files[i].thumbnailLink) {
                            // largest possible thumb
                            f.thumb = files[i].thumbnailLink.replace(/(\?bounding_box=)(.*)(&)/, "$1" + "2048" + "$3")
                        }

                        blobs.push(f);                                    
                    }
                    weavyFilebrowser.helpers.insert(blobs, "dropbox");
                },
            };
            Dropbox.choose(options);
        });
    })
})();