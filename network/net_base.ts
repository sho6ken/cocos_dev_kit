/**
 * 數據緩存
 */
export type NetBuf = string | ArrayBufferLike | Blob | ArrayBufferView;

/**
 * 協議編號
 */
export type NetCmd = string;

/**
 * 網路事件
 */
export type NetEvent = (cmd: NetCmd, buf: NetBuf) => void;

/**
 * 協議處理
 */
export interface NetHandler {
    /**
     * 負責人
     */
    sender: any;

    /**
     * 處理回調
     */
    event: NetEvent;
}

/**
 * 協議請求
 */
export interface NetReq {
    /**
     * 協議編號
     */
    cmd: NetCmd;

    /**
     * 數據內容
     */
    buf: NetBuf;

    /**
     * 回調對象
     */
    resp: NetHandler;
}

/**
 * 數據處理助手
 */
export interface NetHelper {
    /**
     * 取得心跳包
     */
    getHeartbeat(): { cmd: NetCmd, buf: NetBuf };

    /**
     * 取得包頭長度
     */
    getHeadLen(buf: NetBuf): number;

    /**
     * 取得包體長度
     */
    getBodyLen(buf: NetBuf): number;

    /**
     * 數據包是否合法
     */
    isLegal(buf: NetBuf): boolean;

    /**
     * 取得協議編號
     */
    getCmd(buf: NetBuf): NetCmd;
}

/**
 * 連線參數
 */
export interface NetConnOpt {
    /**
     * 連線位置
     */
    addr: string;

    /**
     * 可重連次數
     */
    chances: number;
}

/**
 * socket介面
 */
export interface NetSocket {
    /**
     * 收到訊息
     */
    onMessage: (buf: NetBuf) => void;

    /**
     * 成功連線
     */
    onConnected: (event: any) => void;

    /**
     * 連線異常
     */
    onError: (event: any) => void;

    /**
     * 連線中斷
     */
    onClosed: (event: any) => void;

    /**
     * 發起連線
     * @param opt 連線參數
     */
    connect(opt: NetConnOpt): boolean;

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 錯誤原因
     */
    disconnect(code?: number, reason?: string): void;

    /**
     * 發送訊息
     * @param buf 數據內容
     */
    sendMsg(buf: NetBuf): boolean;
}

/**
 * 連線提示
 * @summary 介面用
 */
export interface NetHint {
    /**
     * 連線中
     * @param enable 開關
     */
    connecting(enable: boolean): void;

    /**
     * 重新連線中
     * @param enable 開關
     */
    reconnecting(enable: boolean): void;

    /**
     * 數據請求中
     * @param enable 開關
     */
    requesting(enable: boolean): void;
}

/**
 * 連線狀態
 */
export enum NetState {
    Closed,      // 連線關閉
    Connecting,  // 連線中
    Connected,   // 已連線
    Resending,   // 數據重送中
}
