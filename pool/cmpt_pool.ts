import { ObjPool } from "./obj_pool";

/**
 * 組件池物件
 */
export interface CmptPoolObj {
    /**
     * 被取用
     */
    onFetch(): void;

    /**
     * 被回收
     */
    onRecycle(): void;
}

/**
 * 組件池
 */
export abstract class CmptPool extends ObjPool<cc.Component, cc.Node> {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 取得物件
     */
    public fetch(key: cc.Component): cc.Node {
        let node = super.fetch(key);
        node.getComponent(key.name)?.onFetch();
        return node;
    }

    /**
     * 取得物件上的組件
     */
    public fetchCmpt(key: cc.Component): cc.Component {
        let node = this.fetch(key);
        let cmpt = node.getComponent(key.name);
        return cmpt;
    }

    /**
     * 生成物件
     */
    protected abstract spawn(key: cc.Component): cc.Node;

    /**
     * 回收物件
     */
    public recycle(key: cc.Component, value: cc.Node): void {
        value.getComponent(key.name)?.onRecycle();
        super.recycle(key, value);
    }
}
