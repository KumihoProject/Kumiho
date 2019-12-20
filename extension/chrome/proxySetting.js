const allURLs = {
    urls: ["*://*.klay/"],
}

const script = function () {
    function FindProxyForURL(url, host) {
        if (url.match('.klay')) {
            return 'PROXY 127.0.0.1:3000';
        }
        return 'DIRECT';
    }
}

var config = {
    mode: 'pac_script',
    pacScript: {
        data: "function FindProxyForURL(url, host) {\n" +
                "  if (host.substring(host.length-5, host.length) == '.klay')\n" +
                "    return 'PROXY localhost:3000';\n" +
                "  return 'DIRECT';\n" +
                "}"
    }
}

// var config = {
//     mode: "fixed_servers",
//     rules: {
//         proxyForHttp: {
//         scheme: "socks5",
//         host: "localhost:3000"
//         },
//     }
// }

document.addEventListener("DOMContentLoaded", function () {
    chrome.proxy.settings.set(
        {
            'value' : config
        }
    );
});
  