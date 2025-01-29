/**
 * 日誌類型
 * @summary 編號使用2進位制
 */
export enum LogType {
    Trace   = 1,  // 標準日誌
    Network = 2,  // 網路相關
}

/**
 * 日誌配置
 * @summary 編號對齊類型
 */
const LogConf: { [type: number]: { title: string, color: string } } = {
    1: { title: `trace`, color: `color:black;` },
    2: { title: `network`, color: `color:#ee7700;` },
};

/**
 * 除錯日誌
 */
export class Logger {
    /**
     * 打印旗標
     * @summary 全開
     */
    private static _flags: number =  Number.MAX_SAFE_INTEGER;

    /**
     * 設定需要打印的種類
     * @param flags 不傳代表全關
     */
    public static setFlags(...types: LogType[]): void {
        this._flags = 0;
        types.forEach(type => this._flags |= type, this);
    }

    /**
     * 此旗標是否需要打印
     */
    private static opened(type: LogType): boolean {
        return (this._flags & type) !== 0;
    }

    /**
     * 打印遊戲日誌
     * @param msg 訊息
     * @param hint 補充說明
     */
    public static trace(msg: any, hint: string = ``): void {
        this.print(LogType.Trace, msg, hint);
    }

    /**
     * 打印網路日誌
     * @param msg 訊息
     * @param hint 補充說明
     */
    public static network(msg: any, hint: string = ``): void {
        this.print(LogType.Network, msg, hint);
    }

    /**
     * 打印日誌
     * @param type 種類
     * @param msg 訊息
     * @param hint 補充說明
     */
    private static print(type: LogType, msg: any, hint: string = ``): void {
        if (!this.opened(type)) {
            return;
        }

        let conf = LogConf[type];
        let color = conf.color;
        let time = this.getTime();
        let title = conf.title;
        let stack = this.getCallStack();

        console.log(`%c[%s][%s][%s]%s:%o`, color, time, title, stack, hint, msg);
    }

    /**
     * 取得調用位置
     */
    private static getCallStack(): string {
        let err = new Error();
        let contents = err.stack!.split(`\n`);
        
        for (const elm of contents) {
            let slices = elm.substring(7).split(` `);

            if (slices.length >= 2 && elm.indexOf(this.name) === -1) {
                return slices[0];
            }
        }

        return ``;
    }

    /**
     * 取得時間字段
     */
    private static getTime(): string {
        let res = ``;

        // 空位補0並加入字串
        const append = function(time: number, count: number, symbol: string = ``): void {
            res += (Array(3).join(`0`) + time).slice(-count) + symbol;
        }

        let date = new Date();
        append(date.getHours(), 2, `:`);
        append(date.getMinutes(), 2, `:`);
        append(date.getSeconds(), 2, `:`);
        append(date.getMilliseconds(), 3);

        return res;
    }
}
