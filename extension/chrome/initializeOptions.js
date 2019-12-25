const initialOptions = {
    nameServerUrl: "127.0.0.1:3000"
};

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        options: initialOptions
    }, function () {
        console.log("initializeOptions: ", initialOptions);
    });
});