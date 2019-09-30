var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.dropbox = (function () {
    $(function () {
        $("button.dropbox").on("click", function () {

            var options = {
                multiselect: true,
                success: function (files) {
                    var selected = [];
                    for (var i = 0; i < files.length; i++) {
                        selected.push({ url: files[i].link, title: files[i].name, guid: weavyFilebrowser.filebrowser.contentType() })
                    }

                    weavyFilebrowser.helpers.add(selected, 'dropbox'); 
                },
            };
            Dropbox.choose(options);
        });
    })
})();