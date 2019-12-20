function FindProxyForURL(url, host) {
    if (url.match('.klay')) {
        console.log('test');
        return 'PROXY 127.0.0.1:3000';
    }
    return 'DIRECT';
}