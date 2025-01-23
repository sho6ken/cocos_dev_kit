/**
 * 事件名稱
 */
export type EventKey = string;

/**
 * 事件資料
 */
export interface EventData {
    /**
     * 事件名稱
     */
    key: EventKey;

    /**
     * 回調函式名稱
     */
    cbName: string;

    /**
     * 是否只觸發單次
     */
    once: boolean;
}

/**
 * 事件處理回調
 */
export type EventHandler = (...params: any[]) => void;

/**
 * 事件轉接
 */
export class EventBridge {
    /**
     * 依類別建構子分類的事件資料
     */
    public static classify = new Map<Function, EventData[]>();

    /**
     * 註冊事件回調時觸發
     */
    protected static onRegister: (host: object, key: EventKey, handler: EventHandler, once: boolean) => void;

    /**
     * 註銷事件回調時觸發
     */
    protected static onUnregister: (host: object) => void;

    /**
     * 註冊事件回調
     * @param host 所屬類別
     * @param parent 是否包含父類一併處理
     */
    public static register(host: object, parent: boolean = true): void {
        if (parent) {
            this.classify.forEach((list, obj) => {
                if (host instanceof obj) {
                    list.forEach(item => this.onRegister(host, item.key, host[item.cbName], item.once), this);
                }
            }, this);

            return;
        }

        var list = this.classify.get(host.constructor);
        list.forEach(item => this.onRegister(host, item.key, host[item.cbName], item.once), this);
    }

    /**
     * 註銷事件回調
     * @param host 所屬類別
     */
    public static unregister(host: object): void {
        if (host) {
            this.onUnregister(host);
        }
    }
}
