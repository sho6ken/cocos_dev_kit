import { SingleObj } from "../singleton/single_obj";

/**
 * 物件池
 */
export abstract class ObjPool<TK, TV> implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 池
     */
    protected declare _pools: Map<TK, TV[]>;

    /**
     * 初始化
     */
    public onInit(): void {
        this._pools = new Map();
    }

    /**
     * 關閉
     */
    public onClose(): void {
        Array.from(this._pools.keys()).forEach(key => this.clear(key), this);
        this._pools.clear();
    }

    /**
     * 清除物件池
     */
    public clear(key: TK): void {
        if (!this._pools.has(key)) {
            return;
        }

        let items = this._pools.get(key);

        items.forEach(item => {
            (item as cc.Node)?.destroy();
            item = null;
        });

        items = [];
        this._pools.delete(key);
    }

    /**
     * 取得池中物數量
     */
    public size(key: TK): number {
        if (!this._pools.has(key)) {
            return 0;
        }

        return this._pools.get(key).length;
    }

    /**
     * 取得物件
     */
    public fetch(key: TK): TV | null {
        if (!this._pools.has(key)) {
            return null;
        }

        var items = this._pools.get(key);
        return items.length > 0 ? items.shift() : this.spawn(key);
    }

    /**
     * 生成物件
     */
    protected abstract spawn(key: TK): TV;

    /**
     * 回收物件
     */
    public recycle(key: TK, value: TV): void {
        if (value == null) {
            return;
        }

        var items = null;

        try {
            if (key == null) {
                return;
            }

            items = this._pools.get(key);

            // 新鍵
            if (!items) {
                items = [];
                this._pools.set(key, items);
            }
        } finally {
            (value as cc.Node)?.destroy();
            (value as cc.Node)?.removeFromParent();

            // 重複回收
            if (!items || items.indexOf(value) != -1) {
                value = null;
                return;
            }

            // 正常回收
            items?.push(value);
        }
    }
}