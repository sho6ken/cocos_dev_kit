/**
 * 異步等待
 */
export class WaitUtil {
    /**
     * 異步等待毫秒
     * @param cmpt 依賴的component, 不依賴則使用window
     */
    public static async waitMS(ms: number, cmpt?: cc.Component): Promise<void> {
        await new Promise(resolve => {
            if (cmpt) {
                cmpt.scheduleOnce(resolve, ms / 1000);
            } else {
                window.setTimeout(resolve, ms);
            }
        });
    }

    /**
     * 異步等待秒
     * @param cmpt 依賴的component, 不依賴則使用window
     */
    public static async waitSec(sec: number, cmpt?: cc.Component): Promise<void> {
        await new Promise(resolve => {
            if (cmpt) {
                cmpt.scheduleOnce(resolve, sec);
            } else {
                window.setTimeout(resolve, sec * 1000);
            }
        });
    }
}
