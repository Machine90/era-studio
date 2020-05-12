import axios from 'axios';

/**
 * If want to request to proxy server, developers should specific
 * the proxy target so that client can request to target server with 
 * given parameters.
 */ 
export interface Proxy {
    host: string;
    port: number;
    // noting, proxyTarget is a rest api that can receive the request.
    proxyTarget: string;
}

/**
 * A proxy server must implementation this structure, api with these arguments.
 * So that we can request to the proxy server.
 */ 
interface ProxyForm {
    target: string;
    method: Method;
    contentType: ContentType;
    data?: any;
}

type Method = "get" | "post";
type ContentType = "json" | "form" | "text" | "xml";

export default class HttpClient {

    public static async getProxy(proxy: Proxy, url: string, headers?: Map<string, string>, queries?: any): Promise<any> {
        return this.requestProxy(proxy, "get", "form", url, headers, queries);
    }

    public static async postProxy(proxy: Proxy, url: string, headers?: Map<string, string>, queries?: any): Promise<any> {
        return this.requestProxy(proxy, "post", "json", url, headers, queries);
    }

    /**
     * Request to specific proxy with request data, if the proxy is not given, the origin response
     * would be returned. Thus make sure your proxy is given if you use this method.
     * @param proxy
     */
    public static async requestProxy(proxy: Proxy, method: Method, type: ContentType, url: string, headers?: Map<string, string>, data?: any): Promise<any> {
        if (proxy === undefined || proxy === null || proxy.host === undefined) {
            return this.request(method, type, url, headers, data);
        }
        let host;
        if (proxy.host !== undefined) {
            host = proxy.host.startsWith("http") ? proxy.host : "http://" + proxy.host;
        }
        if (proxy.port !== undefined) {
            host += ":" + proxy.port;
        }
        const proxyRequest: ProxyForm = {
            "target": host + url, 
            "method": method,
            "contentType": type,
            "data": data
        };
        this.post(proxy.proxyTarget, undefined, proxyRequest);
    }

    public static async get(url: string, headers?: Map<string, string>, queries?: any): Promise<any> {
        return this.request("get", "form", url, headers, queries);
    }

    public static async post(url: string, headers?: Map<string, string>, data?: any): Promise<any> {
        return this.request("post", "json", url, headers, data);
    }

    /**
     * This method using to request target server with parameters.
     * @param method method of request, "get" "post"
     * @param type content-type of your request.
     * @param url request url
     * @param headers headers
     * @param data request body, of content type is form, then we parse it as k=v&k=v format
     */
    public static async request(method: Method, type: ContentType, url: string, headers?: Map<string, string>, data?: any): Promise<any> {
        
        const headerMap: object = {"Content-Type": this.mappingContentType(type)};
        if (headers !== undefined && headers !== null) {
            headers.forEach((k,v) => {
                if (v === null || v === undefined) {
                    return;
                }
                headerMap[k] = v;
            })
        }

        let request;
        if (method === "get") {
            if (data !== undefined && data !== null) {
                url += "?" + this.convertForm(data);
            }
            request = axios.create().get(url, {headers: headerMap});
        } else {
            if (type === "form") {
                data = this.convertForm(data);
            }
            request = axios.create().post(url, data, {headers: headerMap});
        }

        return new Promise((resolve, reject) => {
            request
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    resolve({status: this.splitStatusCode(error.message)});
                });
        });
    }

    public static convertForm(data: any): string {
        let param = '';
        let value;
        for(const key of Object.keys(data)) {
            value = data[key];
            if (value === undefined || value === null) {
                continue;
            }
            param += key + '=' + encodeURIComponent(value)+ '&';
        }
        return param.substring(0, param.length - 1);
    }

    private static splitStatusCode ( message: string ): number {
        message = message.replace('\n', '');
        const codeMsg: string = 'status code ';
        const statusIdx: number = message.indexOf(codeMsg, 1);
        if (statusIdx === -1) {
            return -1;
        }
        const statusCode: string = message.substring(statusIdx + codeMsg.length, statusIdx + codeMsg.length + 3);
        return parseInt(statusCode.trim(), 6);
    }

    private static mappingContentType(type: ContentType): string {
        switch(type) {
            case "json": return "application/json";
            case "form": return "application/x-www-form-urlencoded";
            case "text": return "text/plain";
            case "xml": return "text/xml";
        }
        return "text/plain";
    }
}