import { SingleObj } from "../singleton/single_obj";

/**
 * 資料表結構
 */
export interface TableStruct {
    /**
     * 編號
     */
    id: number;

    // /**
    //  * 
    //  * @param data 單筆資料的json
    //  * @summary 讓實作類決定實際的資料結構與內容, 因為有時會進行再次加工方便使用
    //  */
    // constructor(data: any) {
    //     this.id = data.id;
    //     // TODO: 其他資料處理
    // }
}

/**
 * 資料表數據
 */
export abstract class TableData<T extends TableStruct> implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 數據資料
     */
    protected _items = new Map<number, T>();

    /**
     * 初始化
     * @param src 整張表的json
     */
    public init(src: any): void {
        if (!src) {
            return;
        }

        let len = src.length;

        if (len <= 0) {
            console.warn(`table ${this.name} init failed, src is null`);
            return;
        }

        for (let i = 0; i < len; i++) {
            let id = src[i].id;

            if (!id || this._items.has(id)) {
                console.warn(`table ${this.name} init failed, id ${id} repeat`);
                continue;
            }

            this._items.set(id, this.creator(src[i]));
        }
    }

    /**
     * 生成單筆資料
     * @param data 單筆資料json
     */
    protected abstract creator(data: any): T; /*{
        return new TableStruct(data);  // TODO: 改成實作類
    }*/

    /**
     * 關閉
     */
    public close(): void {
        this._items.forEach(item => item = null);
        this._items.clear();
    }

    /**
     * 取得數據
     * @param id 數據編號
     */
    public get(id: number): T {
        return this._items.get(id);
    }

    /**
     * 打印資訊
     */
    public print(): void {
        console.group(this.name);
        console.table(this._items.values());
        console.groupEnd();
    }
}
