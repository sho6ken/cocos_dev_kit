import { EventBridge, EventKey } from "./event_bridge";

/**
 * 複寫類別方法
 * @param host 所屬類別
 * @param on 開始方法名稱
 * @param off 結束方法名稱
 */
function rewrite(host: any, on: string, off: string): void {
    // 開始方法
    let onFunc = host.prototype[on];

    // 在開始方法觸發時, 順便調用事件註冊
    host.prototype[on] = function(): void {
        EventBridge.register(this);
        onFunc && onFunc.call(this);
    }

    // 結束方法
    let offFunc = host.prototype[off];

    // 在結束方法觸發時, 順便調用事件註銷
    host.prototype[off] = function(): void {
        EventBridge.unregister(this);
        offFunc && offFunc.call(this);
    }
}

/**
 * 類別裝飾
 * @summary 標註在類別上方表明內部有需要監聽事件的函式
 */
export function eventClass(): Function {
    /**
     * 
     * @param host 所屬類別
     * @summary 在component的enable時註冊監聽, 在disable時註銷監聽
     */
    return function(host: any): void {
        rewrite(host, `onEnable`, `onDisable`);
    }
}

/**
 * 函式裝飾
 * @param key 事件名稱
 * @param once 是否只觸發單次
 * @summary 標註在函式上方表示監聽某事件
 */
export function eventFunc(key: EventKey, once: boolean = false): Function {
    /**
     * 
     * @param host 所屬類別
     * @param name 函式名稱
     */
    return function(host: any, name: string, desc: PropertyDescriptor): void {
        let list = EventBridge.classify.get(host.constructor);

        if (list == null) {
            list = [];
            EventBridge.classify.set(host.constructor, list);
        }

        let data = { key: key, cbName: name, once: once };
        list.push(data);
    }
}
