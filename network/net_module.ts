import { SingleObj } from "../singleton/single_obj";
import { NetBuf, NetCmd, NetConnOpt, NetHandler } from "./net_base";
import { NetNode } from "./net_node";

/**
 * 連線模塊
 */
export class NetModule implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 連線頻道
     */
    private declare _channels: Map<number, NetNode>;

    /**
     * 初始化
     */
    public init(): void {
        this._channels = new Map();
    }

    /**
     * 關閉
     */
    public close(): void {
        Array.from(this._channels.keys()).forEach(id => this.delChannel(id), this);
        this._channels.clear();
    }

    /**
     * 新增頻道
     * @param node 連線節點
     */
    public addChannel(node: NetNode, id: number = 0): boolean {
        if (this._channels.has(id)) {
            console.warn(`net add channel ${id} failed, id repeat`, node);
            return false;
        }

        this._channels.set(id, node);
        console.log(`net add channel ${id} succeed`);

        return true;
    }

    /**
     * 移除頻道
     */
    public delChannel(id: number = 0): void {
        if (!this._channels.has(id)) {
            console.warn(`net del channel ${id} failed, id not found`);
            return;
        }

        let node = this._channels.get(id);
        node?.closeConn();
        node = null;
        this._channels.delete(id);

        console.log(`net del channel ${id} succeed`);
    }

    /**
     * 頻道連線
     * @param opt 連線參數
     */
    public openChannel(opt: NetConnOpt, id: number = 0): boolean {
        if (!this._channels.has(id)) {
            console.warn(`net open channel ${id} failed, id not found`);
            return false;
        }

        return this._channels.get(id).startConn(opt);
    }

    /**
     * 頻道斷線
     */
    public closeChannel(id: number = 0): void {
        if (!this._channels.has(id)) {
            console.warn(`net close channel ${id} failed, id not found`);
            return;
        }

        this._channels.get(id).closeConn();
    }

    /**
     * 發送訊息
     * @param cmd 協議編號
     * @param buf 數據內容
     */
    public sendMsg(cmd: NetCmd, buf: NetBuf, id: number = 0): boolean {
        if (!this._channels.has(id)) {
            console.warn(`net send msg ${cmd} failed, channel ${id} not found`, buf);
            return false;
        }

        return this._channels.get(id).sendMsg(cmd, buf);
    }

    /**
     * 發送請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param resp 回應處理
     */
    public sendReq(cmd: NetCmd, buf: NetBuf, resp: NetHandler, id: number = 0): void {
        if (!this._channels.has(id)) {
            console.warn(`net send req ${cmd} failed, channel ${id} not found`, buf);
            return;
        }

        this._channels.get(id).sendReq(cmd, buf, resp);
    }

    /**
     * 發送唯一請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param resp 回應處理
     */
    public sendUnique(cmd: NetCmd, buf: NetBuf, resp: NetHandler, id: number = 0): boolean {
        if (!this._channels.has(id)) {
            console.warn(`net send unique ${cmd} failed, channel ${id} not found`, buf);
            return false;
        }

        return this._channels.get(id).sendUnique(cmd, buf, resp);
    }
}
