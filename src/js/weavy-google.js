var weavyFilebrowser = weavyFilebrowser || {};

weavyFilebrowser.google = (function () {

    //--------------------------------------------------------------
    // Google api
    //--------------------------------------------------------------    
    var developerKey = "AIzaSyDV97LeMmjAMyVQAOUqZH5bU4GFk3-Qwn4";
    var clientId = "284489188582-c221gv8ubafv46c0bokohu3cri4589tv.apps.googleusercontent.com";

    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    var pickerApiLoaded = false;
    var oauthToken;
    var authorized = false;
    var action = null;
    var docTitle = "";
    var docType = "";
    var docGuid = "";
    var origin = "";

    // authorization scopes required by the API; multiple scopes can be included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/drive";

    // buttons
    var authorizeButton = $("button.create-auth")[0];
    var pickerButton = $("button.google-drive,a.google-drive")[0];
    var signoutButton = document.getElementById("signout-button");

    var initClient = function (origin) {
        gapi.client.init({
            apiKey: developerKey,
            clientId: clientId,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            pickerButton.onclick = handlePickerClick;
            signoutButton.onclick = handleSignoutClick;
            weavyFilebrowser.helpers.post("google-init-complete");
        });
    }

    var create = function (title, type, guid) {
        if (authorized) {
            handleCreateDocument(title, type, guid);
        } else {
            docTitle = title;
            docType = type;
            docGuid = guid;
            action = "create";

            gapi.auth2.getAuthInstance().signIn().catch(function (e) {
                weavyFilebrowser.helpers.post("google-cancelled");
            });
        }
    }

    var handleCreateDocument = function (title, type, guid) {
        var fileMetadata = {
            "name": title,
            "mimeType": "application/vnd.google-apps." + type
        };
        gapi.client.drive.files.create({
            resource: fileMetadata,
            "fields": '*'
        }).then(function (response) {
            switch (response.status) {
                case 200:
                    var file = response.result;
                    var id = file.id;                    
                    
                    // NOTE: trying to get a link suitable for embedding in Weavy
                    var embedSuffix = type === "sheet" ? "/htmlembed" : "/preview";
                    var embedLink = file.webViewLink.substr(0, file.webViewLink.lastIndexOf("/")) + embedSuffix;

                    weavyFilebrowser.helpers.insert([{ name: file.name, provider: "Google Drive", link: file.webViewLink, embed: embedLink, media_type: file.mimeType, size: 0, raw: file }], "google-drive", true);

                    oauthToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
                    updateFilePermission(id, oauthToken);
                    break;
                default:
                    console.log("Error creating file: " + response);
                    break;
            }
        });
    }

    var handleClientLoad = function (source) {
        origin = source;
        gapi.load("client:auth2", initClient);
        gapi.load("picker", onPickerApiLoad);
    }

    var updateFilePermission = function (fileID, token) {
        var permissionBody = {
            "role": "reader",
            "type": "anyone"
        };

        var domain = gapi.auth2.getAuthInstance().currentUser.get().getHostedDomain();

        if (domain) {
            permissionBody = {
                "role": "writer",
                "type": "domain",
                "domain": domain
            };
        }

        var req = gapi.client.request({
            "path": "/drive/v3/files/" + fileID + "/permissions",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            "body": permissionBody
        });
        req.execute(function (resp) { });
    }

    function handlePickerClick() {
        if (authorized) {
            oauthToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            createPicker();
            weavyFilebrowser.helpers.post("google-selected");
        } else {
            action = "pick";
            gapi.auth2.getAuthInstance().signIn();
        }
    }

    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            weavyFilebrowser.helpers.post("google-user-authenticated");
            authorizeButton.style.display = "none";
            signoutButton.style.display = "inline-block";
            authorized = true;

            if (action != null) {
                switch (action) {
                    case "create":
                        handleCreateDocument(docTitle, docType, docGuid);
                        break;
                    case "pick":
                        handlePickerClick();
                        break;
                    default:
                }
                // reset action
                action = null;
            }
        } else {
            authorizeButton.style.display = "inline-block";
            signoutButton.style.display = "none";
            authorized = false;
        }
    }

    function onPickerApiLoad() {
        pickerApiLoaded = true;
        createPicker();
    }

    function createPicker() {
        if (pickerApiLoaded && oauthToken) {
            var view = new google.picker.DocsView();
            view.setParent("root");
            view.setIncludeFolders(true);

            var picker = new google.picker.PickerBuilder().
                addView(view).
                setOrigin(origin).
                setOAuthToken(oauthToken).
                setDeveloperKey(developerKey).
                setCallback(pickerCallback);

            if (weavyFilebrowser.filebrowser.multiple()) {
                picker = picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            }
            picker = picker.build().setVisible(true);
        }
    }

    function pickerCallback(data) {
        var url = "nothing";

        if (data[google.picker.Response.ACTION] == google.picker.Action.CANCEL) {
            weavyFilebrowser.helpers.close();
        }

        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {

            var blobs = [];
            for (var i = 0; i < data[google.picker.Response.DOCUMENTS].length; i++) {

                var doc = data[google.picker.Response.DOCUMENTS][i];

                var f = {
                    provider: "Google Drive",
                    link: doc[google.picker.Document.URL],
                    name: doc[google.picker.Document.NAME],
                    media_type: doc[google.picker.Document.MIME_TYPE],
                    embed: doc[google.picker.Document.EMBEDDABLE_URL] || null,
                    size: doc.sizeBytes || 0,
                    raw: doc
                }

                if (doc[google.picker.Document.THUMBNAILS] && doc[google.picker.Document.THUMBNAILS].count) {
                    f.thumb = doc[google.picker.Document.THUMBNAILS][0][google.picker.Thumbnail.URL]
                }
                blobs.push(f);
                var fileID = doc[google.picker.Document.ID];
                updateFilePermission(fileID, oauthToken);
            }
            weavyFilebrowser.helpers.insert(blobs, "google-drive");
        }
    }

    return {
        onLoad: handleClientLoad,
        create: create
    }
})();