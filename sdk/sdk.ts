enum Method {
    GET = 'GET',
    POST = 'POST',
}

class ExitPlan implements ExitPlanInterface {
    browser: string;
    extensionId: string;
    constructor () {
        this.extensionId = ''
        this.browser = navigator.userAgent.indexOf('Chrome')?
            'chrome' : navigator.userAgent.indexOf('Firefox')?
                'firefox' : 'other';
    }

    private requestExtension (req: Object): Promise<any> {
        if (this.browser === 'chrome') {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    this.extensionId,
                    req,
                    (response) => {
                        if (response.complete) {
                            resolve(response);
                        } else {
                            reject(response);
                        }
                    }
                );
            });
        } else {
            return new Promise((resolve, reject) => {
                reject();
            })
        }
    }

    callAPI (url: string, method: Method, args: Array<any>, value: number) {
        return this.requestExtension({
            protocol:'api-call',
            url,
            method, // pure, view function 요청은 GET 나머지는 POST
            args,
            value
        });
    }

    sendByAddress (address: string, value: number) {
        return this.requestExtension({
            protocol: 'send-address',
            value,
        });
    }

    sendByUrl(url, value) {
        // todo
    }
}

interface ExitPlanInterface {
    callAPI (url: string, method: Method, args: Array<any>, value: number): Promise<any>;
    sendByAddress (address: string, value: number): Promise<any>;
}

export default new ExitPlan();