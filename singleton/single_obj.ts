/**
 * 單例物件介面
 */
export interface SingleObj {
    /**
     * 名稱
     */
    name: string;

    /**
     * 初始化
     */
    init?(...params: any[]): any;

    /**
     * 關閉
     */
    close?(...params: any[]): any;
}
