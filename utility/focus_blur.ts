import { EventModule } from "../event/event_module";
import { Singleton } from "../singleton/singleton";

/**
 * 不支援的瀏覽器
 */
const NO_SUP_WEB = [cc.sys.BROWSER_TYPE_UC];

/**
 * 聚焦失焦
 */
export class FocusBlur {
    /**
     * 
     */
    constructor() {
        // web
        if (cc.sys.isBrowser && NO_SUP_WEB.indexOf(<string>cc.sys.browserType) == -1) {
            cc.game.on(cc.game.EVENT_SHOW, this.onFocus.bind(this), this);
            cc.game.on(cc.game.EVENT_HIDE, this.onBlur.bind(this), this);
            return;
        }

        // 原生
        if (window && window.addEventListener) {
            window.addEventListener("focus", this.onFocus.bind(this));
            window.addEventListener("blur", this.onBlur.bind(this));
            return;
        }
    }

    /**
     * 關閉
     */
    public close(): void {
        // web
        if (cc.sys.isBrowser && NO_SUP_WEB.indexOf(<string>cc.sys.browserType) == -1) {
            cc.game.off(cc.game.EVENT_SHOW, this.onFocus.bind(this), this);
            cc.game.off(cc.game.EVENT_HIDE, this.onBlur.bind(this), this);
            return;
        }

        // 原生
        if (window && window.removeEventListener) {
            window.removeEventListener("focus", this.onFocus.bind(this));
            window.removeEventListener("blur", this.onBlur.bind(this));
            return;
        }
    }

    /**
     * 聚焦
     */
    private onFocus(): void {
        Singleton.get(EventModule).emit("ViewFocus");
    }

    /**
     * 失焦
     */
    private onBlur(): void {
        Singleton.get(EventModule).emit("ViewBlur");
    }
}
