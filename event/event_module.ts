import { SingleObj } from "../singleton/single_obj";
import { EventBridge, EventHandler, EventKey } from "./event_bridge";

/**
 * 事件資料
 */
interface EventData {
    /**
     * 事件回調
     */
    handler: EventHandler;

    /**
     * 是否只觸發單次
     */
    once: boolean;
}

/**
 * 事件模塊
 */
export class EventModule extends EventBridge implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 常駐物件
     * @summary 不會因閒置被釋放
     */
    public get hold(): boolean { return true; }

    /**
     * 事件處理列表
     */
    private declare _handlers: Map<EventKey, Map<Object, EventData[]>>;

    /**
     * 初始化
     */
    public init(): void {
        this._handlers = new Map();

        // 註冊事件回調時觸發
        EventBridge.onRegister = this.on.bind(this);

        // 註銷事件回調時觸發
        EventBridge.onUnregister = host => {
            this._handlers.forEach(map=> map.delete(host), this);
        };
    }

    /**
     * 關閉
     */
    public close(): void {
        EventBridge.classify.clear();
        EventBridge.onRegister = null;
        EventBridge.onUnregister = null;

        this._handlers.forEach(map => map.clear());
        this._handlers.clear();
    }

    /**
     * 增加事件監聽
     * @param host 所屬類別
     * @param key 事件名稱
     * @param handler 處理回調
     * @param once 是否只觸發單次
     */
    public on(host: Object, key: EventKey, handler: EventHandler, once: boolean = false): void {
        if (key == null || key.length <= 0) {
            return;
        }

        if (host == null || handler == null) {
            return;
        }

        let map = this._handlers.get(key);

        if (map == null) {
            map = new Map();
            this._handlers.set(key, map);
        }

        let list = map.get(host);

        if (list == null) {
            list = [];
            map.set(host, list);
        }

        if (list.findIndex(data => { return data.handler == handler }) != -1) {
            return;
        }

        let data = { handler: handler, once: once };
        list.push(data);
    }

    /**
     * 增加單次事件監聽
     * @param host 所屬類別
     * @param key 事件名稱
     * @param handler 處理回調
     */
    public once(host: Object, key: EventKey, handler: EventHandler): void {
        this.on(host, key, handler, true);
    }

    /**
     * 取消事件監聽
     * @param host 所屬類別
     * @param key 事件名稱
     * @param handler 處理回調
     */
    public off(host: Object, key: EventKey, handler: EventHandler): void {
        if (key == null || key.length <= 0) {
            return;
        }

        if (host == null || handler == null) {
            return;
        }

        let map = this._handlers.get(key);

        if (map == null) {
            return;
        }

        let list = map.get(host);

        if (list == null) {
            return;
        }

        let idx = list.findIndex(data => { return data.handler == handler });

        if (idx == -1) {
            return;
        }

        list.splice(idx, 1);
    }

    /**
     * 事件派發
     * @param key 事件名稱
     * @param params 各種參數
     */
    public emit(key: EventKey, ...params: any[]): void {
        this.getHandlers(key).forEach(item => item.handler.apply(item.host, params));
    }

    /**
     * 取得所有監聽此事件的對象
     * @param key 事件名稱
     */
    private getHandlers(key: EventKey): { host: Object, handler: EventHandler }[] {
        let map = this._handlers.get(key);

        if (map == null) {
            return [];
        }

        let list2 = [];
        let list1 = [];

        map.forEach((list, obj) => {
            list.forEach(data => {
                let item = { host: obj, handler: data.handler };

                // 多次觸發
                list2.push(item);

                // 單次觸發
                data.once && list1.push(item);
            });
        });

        // 刪除單次觸發
        for (const item of list1) {
            this.off(item.host, key, item.handler);
        }

        return list2;
    } 
}
