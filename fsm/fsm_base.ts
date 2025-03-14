import { FsmState } from "./fsm_state";

/**
 * 狀態機控制
 */
export class FsmBase<T> {
    /**
     * 狀態機持有人
     */
    protected declare _owner: T;

    /**
     * 狀態機持有人
     */
    public get owner(): T { return this._owner; }

    /**
     * 狀態列表
     */
    protected _states = new Map<number, FsmState<T>>();

    /**
     * 當前狀態
     */
    protected declare _currState: FsmState<T>;

    /**
     * 當前狀態編號
     */
    public get currStateID(): number { return this._currState ? this._currState.id : -1; }

    /**
     * 
     * @param owner 狀態機持有人
     */
    constructor(owner: T) {
        if (owner == null) {
            console.warn(`create fsm failed, owner is null`);
            return;
        }

        this._owner = owner;
    }

    /**
     * 關閉
     */
    public close(): void {
        this._states.forEach(state => {
            state.close();
            state = null;
        });

        this._states.clear();
    }

    /**
     * 新增狀態
     * @param states 狀態列表
     */
    public addStates(...states: FsmState<T>[]): FsmBase<T> {
        if (!states || states.length <= 0) {
            console.warn(`create fsm failed, states are null`, this.owner);
            return null;
        }

        let len = states.length;

        for (let i = 0; i < len; i++) {
            let state = states[i];

            if (state == null) {
                console.warn(`create fsm failed, state ${i} is null`, this.owner);
                return null;
            }

            let id = state.id;

            if (this._states.has(id)) {
                console.warn(`create fsm failed, state ${i} repeat`, this.owner);
                return null;
            }

            this._states.set(id, state);
        }

        return this;
    }

    /**
     * 初始化
     * @param params 初始化參數
     */
    public init(...params: any[]): void {
        Array.from(this._states.values()).forEach(state => state.init(this, ...params), this);
    }

    /**
     * 更新
     */
    public update(dt: number): void {
        this._currState && this._currState.onDraw(dt);
    }

    /**
     * 變更狀態
     * @param id 狀態編號
     * @param params 新狀態onEnter()使用的參數
     */
    public changeState(id: number, ...params: any[]): void {
        if (id == this.currStateID) {
            console.warn(`fsm change state ${id} failed, change the same state`, this.owner);
            return;
        }

        if (!this._states.has(id)) {
            console.warn(`fsm change state ${id} failed, state not found`, this.owner);
            return;
        }

        let oldID = this.currStateID;

        // 舊狀態
        if (oldID != -1) {
            let oldState = this._states.get(oldID);
            oldState.onLeave();
        }

        // 新狀態
        this._currState = this._states.get(id);
        this._currState.onEnter(...params);

        console.log(`fsm change state from ${oldID} to ${id} succeed`);
    }
}