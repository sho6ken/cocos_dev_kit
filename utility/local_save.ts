/**
 * 本地存儲
 */
export class LocalSave {
    /**
     * 存檔
     */
    public static save(key: string, value: any): boolean {
        if (key == null || key.length <= 0) {
            return false;
        }

        // 無值時視作刪除
        if (value == null) {
            this.delete(key);
            return true;
        }

        if (typeof value == `function`) {
            return false;
        }

        if (typeof value == `object`) {
            try {
                value = JSON.stringify(value);
            } catch (e) {
                return false;
            }
        }

        cc.sys.localStorage.setItem(key, value);
    } 

    /**
     * 讀檔
     * @param defValue 預設回傳值
     */
    public static load<T>(key: string, defValue: T): T {
        if (key == null || key.length <= 0) {
            return null;
        }

        let res = cc.sys.localStorage.getItem(key);
        return res ? res : defValue;
    }

    /**
     * 取數值
     * @param defValue 預設值
     */
    public static getNum(key: string, defValue: number = 0): number {
        return this.load(key, defValue);
    }

    /**
     * 取布林
     * @param defValue 預設值
     */
    public static getBool(key: string, defValue: boolean = false): boolean {
        return this.load(key, defValue);
    }

    /**
     * 取字串
     * @param defValue 預設值
     */
    public static getStr(key: string, defValue: string = ``): string {
        return this.load(key, defValue);
    }

    /**
     * 取json
     * @param defValue 預設值
     */
    public static getJson(key: string, defValue: object = {}): any {
        let str = String(this.load(key, defValue));
        return JSON.parse(str);
    }

    /**
     * 刪除
     */
    public static delete(key: string): void {
        if (key == null || key.length <= 0) {
            return;
        }

        cc.sys.localStorage.removeItem(key);
    }

    /**
     * 清空本地存檔
     */
    public static rmrf(): void {
        cc.sys.localStorage.clear();
    }
}
