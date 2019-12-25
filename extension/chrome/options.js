
const input = document.getElementById('nameServerUrlInput');
const saveButton = document.getElementById('nameServerUrlSaveButton');

chrome.storage.sync.get(["options"], ({ options }) => {
    const { nameServerUrl } = options;
    input.value = nameServerUrl;
})

saveButton.addEventListener("click", function () {
    const nameServerUrl = input.value;
    chrome.storage.sync.set({ options: {
        nameServerUrl
    }}, function () {
        console.log(`nameServerUrl: "${nameServerUrl}" saved`);
    })
});
