// NOTE: The function name FindProxyForURL is an interface of the pacScript.
// Do not change unless you know what you're doing.
function FindProxyForURL(_url, host) {
    // NOTE: Check the permissions in the manifest when you change the patterns.
    if (host.substring(host.length - 5, host.length) == '.klay') {
        return 'PROXY 127.0.0.1:3000';
    }
    return 'DIRECT';
}

var config = {
    mode: 'pac_script',
    pacScript: {
        data: FindProxyForURL.toString()
    }
}

// TODO: Check whether DOMContentLoaded is correct to set the proxy settings
document.addEventListener("DOMContentLoaded", function () {
    chrome.proxy.settings.set(
        {
            'value': config
        }
    );
});
