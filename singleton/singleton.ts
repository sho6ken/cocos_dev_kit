import { SingleObj } from "./single_obj";
import { SingleType } from "./single_type";

/**
 * 單例
 */
export class Singleton {
    /**
     * 單例列表
     */
    private static _items = new Map<string, SingleObj>();

    /**
     * 取得單例物件
     * @param type 物件類型
     */
    public static get<T extends SingleObj>(type: SingleType<T>): T {
        let name = type.name;

        if (this._items.has(name)) {
            return this._items.get(name) as T;
        }

        // 生成
        let inst = type.inst ?? new type();  // 優先使用component實例
        this._items.set(name, inst);

        console.log(`single obj ${name} created`);
        inst.onInit();

        return inst;
    }

    /**
     * 關閉所有實例
     */
    public static closeAll(): void {
        Array.from(this._items.keys()).forEach(name => this.doClose(name), this);
    }

    /**
     * 關閉實例
     * @param type 物件類型
     */
    public static close<T extends SingleObj>(type: SingleType<T>): void {
        this.doClose(type.name);
    }

    /**
     * 實作關閉實例
     * @param name 物件名稱
     */
    private static doClose(name: string): void {
        let item = this._items.get(name);

        if (!item) {
            console.warn(`close single obj ${name} failed, item not found`);
            return;
        }

        if (item.hold) {
            console.warn(`close single obj ${name} failed, item is hold`);
            return;
        }

        item.onClose();
        item = null;
        this._items.delete(name);

        console.log(`close single obj ${name} succeed`);
    }
}
