/**
 * 網址處理
 */
export class UrlUtil {
    /**
     * 查詢網址參數
     * @param key 參數名稱
     */
    public static query(key: string): string {
        let reg = new RegExp(`(^|&)` + key + `=([^&]*)(&|$)`, `i`);
        var list = window.location.search.substring(1).match(reg);

        // 當url帶有中文時的轉碼
        return list ? decodeURIComponent(list[2]) : null;
    }

    /**
     * 網頁轉跳
     * @param url 網址
     * @param params 參數
     */
    public static jump(url: string, params?: { key: string, value: string | number }[]): void {
        if (params && params.length > 0) {
            url += `/?`;
            params.forEach(param => url += `${param.key}=${param.value}&`);
            url = url.slice(0, -1);  // 去掉最後的&
        }

        window.location.href = url;
    }

    /**
     * http請求
     * @param url 請求網址
     * @param params 請求參數
     * @param post 是post或get
     * @param resolve 成功回調 
     * @param reject 失敗回調
     */
    public static request(url: string, params: any, post: boolean, resolve: (resp: string) => void, reject: (resp: string) => void): void {
        if (url == null || url.length <= 0) {
            return;
        }

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open(post ? `POST` : `GET`, url, true);
        xhr.setRequestHeader(`Content-Type`, `application/x-www-form-urlencoded`);

        xhr.onreadystatechange = function(): void {
            if (xhr.readyState != 4 || xhr.status != 200) {
                reject(xhr.responseText);
                return;
            }

            resolve(xhr.responseText);
        };

        xhr.send(params);
    }
}
