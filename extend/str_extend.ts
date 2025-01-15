/**
 * 字串擴充
 */
interface String {
    /**
     * 格式化
     * @example `{0}.{1}.{2}`.format(`a`, 9);  // a.9.{2}
     */
    format(...params: (string | number)[]): string;

    /**
     * 取代全部的目標字串
     * @param target 被取代的字串
     * @param replace 取代的字串
     */
    replaceAll(target: string, replace: string): string;
}

/**
 * 
 */
String.prototype.format = function(this: string, ...params: (string | number)[]): string {
    return this.replace(/\{(\d+)\}/g, (src, idx) => params[idx as string]);
}

/**
 * 
 */
String.prototype.replaceAll = function(this: string, target: string, replace: string): string {
    return this.replace(new RegExp(target, `gm`), replace);
}
