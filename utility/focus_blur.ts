/**
 * 不支援的瀏覽器
 */
const NO_SUP_WEB = [cc.sys.BROWSER_TYPE_UC];

/**
 * 聚焦失焦
 */
export class FocusBlur {
    /**
     * 聚焦事件
     */
    private declare _focus: Function;

    /**
     * 失焦事件
     */
    private declare _blur: Function;

    /**
     * 
     * @param focus 聚焦事件
     * @param blur 失焦事件
     */
    constructor(focus: Function, blur: Function) {
        this._focus = focus;
        this._blur = blur;

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

        this._focus = null;
        this._blur = null;
    }

    /**
     * 聚焦
     */
    private onFocus(): void {
        this._focus && this._focus();
    }

    /**
     * 失焦
     */
    private onBlur(): void {
        this._blur && this._blur();
    }
}