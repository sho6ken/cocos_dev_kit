import { EventModule } from "../event/event_module";
import { SingleObj } from "../singleton/single_obj";
import { Singleton } from "../singleton/singleton";

const { ccclass, property, menu, disallowMultiple } = cc._decorator;

/**
 * 更新函式
 */
type TimerUpdate = (dt: number) => void;

/**
 * 全局計時器
 */
@ccclass
@disallowMultiple
@menu(`custom/main_timer`)
export class MainTimer extends cc.Component implements SingleObj {
    /**
     * 實例
     */
    private declare static _inst: MainTimer;

    /**
     * 實例
     */
    public static get inst(): MainTimer { return this._inst; }

    /**
     * 當前的時間縮放
     */
    private _currScale: number = 1;

    /**
     * 當前的時間縮放
     */
    public get currScale(): number { return this._currScale; }

    /**
     * 最後一次的時間縮放
     */
    private _lastScale: number = 1;

    /**
     * 暫停次數
     */
    private _pauseCount: number = 0;

    /**
     * 是否在暫停中
     */
    public get paused(): boolean { return this._pauseCount > 0; }

    /**
     * app啟動至今的秒數
     */
    private _appSec: number = 0;

    /**
     * app啟動至今的秒數
     */
    public get appSec(): number { return this._appSec; }

    /**
     * 固定更新列表
     */
    private _fixed: TimerUpdate[] = [];

    /**
     * 變動更新列表
     */
    private _elastic: TimerUpdate[] = [];

    /**
     * 
     */
    constructor() {
        super();
        MainTimer._inst = this; 
    }

    /**
     * 初始化
     */
    public init(): void {}

    /**
     * 關閉
     */
    public close(): void {
        this._fixed = [];
        this._elastic = [];
        this.clear();
    }

    /**
     * 
     */
    protected update(dt: number): void {
        // 唯一性
        if (MainTimer.inst != this) {
            return;
        }

        this._appSec += dt;

        // 固定列表更新
        this._fixed.forEach(handler => handler(dt));

        // 變動列表更新
        if (!this.paused) {
            let temp = dt * this.currScale;
            this._elastic.forEach(handler => handler(temp));
        }
    }

    /**
     * 清除設定
     */
    public clear(): void {
        this._pauseCount = 0;
        this._currScale = 1;
        this._lastScale = 1;

        this.setScale(1);
    }

    /**
     * 設定時間縮放
     * @param value 0~1 
     */
    public setScale(value: number): void {
        // 暫停中禁止更新
        if (this.paused) {
            return;
        }

        value = value.limit(0, 1);

        if (value == this.currScale) {
            return;
        }

        this._lastScale = this.currScale;
        this._currScale = value;

        // 事件
        Singleton.get(EventModule).emit(`TimerScale`, value);
    }

    /**
     * 暫停
     * @summary 每次計數器加1
     */
    public pause(): void {
        if (this._pauseCount == 0) {
            this.setScale(0);
        }

        this._pauseCount++;
    }

    /**
     * 恢復
     * @summary 每次計數器減1, 等計數器歸0後才會中斷暫停
     */
    public resume(): void {
        if (this._pauseCount <= 0) {
            return;
        }

        this._pauseCount--;
        this._pauseCount <= 0 && this.setScale(this._lastScale);
    }

    /**
     * 加入固定更新列表
     */
    public registerFixed(handler: TimerUpdate): void {
        this._fixed.push(handler);
    }

    /**
     * 加入彈性更新列表
     */
    public registerElastic(handler: TimerUpdate): void {
        this._elastic.push(handler);
    }
}
