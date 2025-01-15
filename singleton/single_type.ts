import { SingleObj } from "./single_obj";

/**
 * 單例類型
 * @summary 用以限制單例類型必須同時具備以下功能
 */
export interface SingleType<T extends SingleObj> {
    /**
     * 名稱
     */
    name: string;

    /**
     * 實例
     * @summary 當物件為component時使用, 可避免另外創建新的單例物件
     * @example protected onLoad(): void { inst = this; }
     */
    inst?: T;

    /**
     * 建構子
     */
    new(): T;
}