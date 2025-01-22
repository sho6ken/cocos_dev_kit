import { NetBuf, NetConnOpt, NetSocket } from "./net_base";

/**
 * web socket
 */
export class WSocket implements NetSocket {
    /**
     * real socket
     */
    private declare _socket: WebSocket;

    /**
     * 收到訊息
     */
    public declare onMessage: (buf: NetBuf) => void;

    /**
     * 成功連線
     */
    public declare onConnected: (event: any) => void;

    /**
     * 連線異常
     */
    public declare onError: (event: any) => void;

    /**
     * 連線中斷
     */
    public declare onClosed: (event: any) => void;

    /**
     * 發起連線
     * @param opt 連線參數
     */
    public connect(opt: NetConnOpt): boolean {
        if (this._socket && this._socket.readyState == WebSocket.CONNECTING) {
            console.warn(`ws connect ${opt.addr} failed`);
            return false;
        }

        this._socket = new WebSocket(new URL(opt.addr));
        this._socket.binaryType = `arraybuffer`;

        // socket event adapt
        this._socket.onmessage = event => this.onMessage(event.data);
        this._socket.onopen = this.onConnected;
        this._socket.onerror = this.onError;
        this._socket.onclose = this.onClosed;

        return true;
    }

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 錯誤原因
     */
    public disconnect(code?: number, reason?: string): void {
        this._socket?.close(code, reason);
    }

    /**
     * 發送訊息
     * @param buf 數據內容
     */
    public sendMsg(buf: NetBuf): boolean {
        if (this._socket == null || this._socket.readyState != WebSocket.OPEN) {
            return false;
        }

        this._socket.send(buf);
        return true;
    }
}
