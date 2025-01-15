/**
 * 單例物件介面
 */
export interface SingleObj {
    /**
     * 名稱
     */
    name: string;

    /**
     * 常駐物件
     * @summary 不會因閒置被釋放
     */
    hold?: boolean;

    /**
     * 初始化
     */
    onInit(...params: any[]): any;

    /**
     * 關閉
     */
    onClose(...params: any[]): any;
}
