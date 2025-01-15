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
     */
    public static load<T>(key: string): T {
        if (key == null || key.length <= 0) {
            return null;
        }

        return cc.sys.localStorage.getItem(key);
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
