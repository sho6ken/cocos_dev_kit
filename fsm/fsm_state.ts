import { FsmBase } from "./fsm_base";

/**
 * 狀態機狀態
 */
export abstract class FsmState<T> {
    /**
     * 狀態機控制
     */
    protected declare _ctrl: FsmBase<T>;

    /**
     * 狀態機持有人
     */
    protected get _owner(): T { return this._ctrl.owner; }

    /**
     * 狀態編號
     */
    public abstract get id(): number;

    /**
     * 初始化
     * @param ctrl 狀態機控制
     * @param params 初始化參數
     */
    public init(ctrl: FsmBase<T>, ...params: any[]): void {
        this._ctrl = ctrl;
    }

    /**
     * 進入此狀態
     * @param params 外部參數
     */
    public abstract onEnter(...params: any[]): void;

    /**
     * 離開此狀態
     * @param param 外部參數
     */
    public abstract onLeave(...param: any[]): void;

    /**
     * 狀態更新
     * @summary 當前為此狀態時才會執行
     */
    public abstract onDraw(dt: number): void;
}
