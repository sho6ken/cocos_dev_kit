/**
 * 狀態機控制
 */
export abstract class FsmBase<T> {
    /**
     * 狀態機持有人
     */
    protected declare _owner: T;

    /**
     * 狀態機持有人
     */
    public get owner(): T { return this._owner; }
}