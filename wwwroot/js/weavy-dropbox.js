var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.dropbox = (function () {
    $(function () {
        $("button.dropbox").on("click", function () {

            var options = {
                multiselect: weavyFilebrowser.filebrowser.multiple,
                success: function (files) {
                    console.log(files);
                    var blobs = [];

                    for (var i = 0; i < files.length; i++) {
                        var f = {
                            provider: "box",
                            link: files[i].link,
                            name: files[i].name,
                            size: files[i].bytes,
                        }

                        if (files[i].thumbnailLink) {
                            // largest possible thumb
                            f.thumb = files[i].thumbnailLink.replace(/(\?bounding_box=)(.*)(&)/, "$1" + "2048" + "$3")
                        }

                        blobs.push(f);                                    
                    }
                    weavyFilebrowser.helpers.insert(blobs, 'box');
                },
            };
            Dropbox.choose(options);
        });
    })
})();