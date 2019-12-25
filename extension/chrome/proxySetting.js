// NOTE: The function name FindProxyForURL is an interface of the pacScript.
// Do not change unless you know what you're doing.
function FindProxyForURL(_url, host) {
    // NOTE: Check the permissions in the manifest when you change the patterns.
    if (host.substring(host.length - 5, host.length) == '.klay') {
        return `PROXY %SERVER%`;
    }
    return 'DIRECT';
}

// TODO: Check whether DOMContentLoaded is correct to set the proxy settings
document.addEventListener("DOMContentLoaded", async function () {
    const server = await getNameServerUrl();

    console.log("DOMContentLoaded");
    console.log("server: ", server);
    var config = {
        mode: 'pac_script',
        pacScript: {
            data: FindProxyForURL.toString().replace(/%SERVER%/i, server)
        }
    };
    chrome.proxy.settings.set(
        {
            'value': config
        }
    );
});

function getNameServerUrl () {
    return new Promise(resolve => {
        chrome.storage.sync.get(["options"], ({ options }) => {
            resolve(options.nameServerUrl);
        })
    });
}