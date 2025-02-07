/**
 * 簡易數據驅動
 * @summary 使變數具備可監聽變化的能力
 */
export class DataDriven<T> {
    /**
     * 真實數值
     */
    private declare _data: T;

    /**
     * 取得數值
     */
    public get data(): T { return this._data; }

    /**
     * 設定數值
     */
    public set data(value: T) {
        if (this._data == value) {
            return;
        }

        this._data = value;
        this.emit(value);
    }

    /**
     * 跳過事件觸發的檢查函式
     */
    private declare _skipper: (data: T) => boolean;

    /**
     * 事件列表
     */
    private declare _events: ((data: T) => void)[];

    /**
     * 
     * @param data 真實數值
     * @param skipper 跳過事件觸發的檢查函式
     */
    constructor(data: T, skipper?: (data: T) => boolean) {
        this._data = data;
        this._skipper = skipper;
        this._events = [];
    }

    /**
     * 清空事件
     */
    public clear(): void {
        this._events = [];
    }

    /**
     * 新增事件
     * @param event 事件回調
     */
    public on(event: (data: T) => void): void {
        if (!this._events.includes(event)) {
            this._events.push(event);
        }
    }

    /**
     * 新增事件
     * @param event 事件回調
     */
    public off(event: (data: T) => void): void {
        let idx = this._events.indexOf(event);
        idx != -1 && this._events.splice(idx, 1);
    }

    /**
     * 觸發事件
     * @param data 變化後的數值 
     */
    private emit(data: T): void {
        // 檢查是否需跳過事件觸發
        if (this._skipper && this._skipper(data)) {
            return;
        }

        this._events?.forEach(event => event(data), this);
    }
}
