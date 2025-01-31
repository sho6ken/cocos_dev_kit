import { SingleObj } from "../singleton/single_obj";

/**
 * 音樂模塊
 */
export class BgmModule implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 常駐物件
     * @summary 不會因閒置被釋放
     */
    public get hold(): boolean { return true; }

    /**
     * 音量
     */
    private declare _vol: number;

    /**
     * 音量
     */
    public get vol(): number { return this._vol; }

    /**
     * 是否已暫停
     */
    private declare _paused: boolean;

    /**
     * 是否已暫停
     */
    public get paused(): boolean { return this._paused; }

    /**
     * 音量緩動
     */
    private declare _fade: cc.Tween;

    /**
     * 是否在緩動中
     */
    private declare _fading: boolean;

    /**
     * 初始化
     */
    public init(): void {
        this._vol = cc.audioEngine.getMusicVolume();
        this._paused = false;
    }

    /**
     * 關閉
     */
    public close(): void {
        this.stop();
        cc.audioEngine.uncacheAll();
    }

    /**
     * 設定音量
     */
    public setVol(vol: number): void {
        vol = vol.limit(0, 1);

        if (vol == this._vol) {
            return;
        }

        this._vol = vol;
        cc.audioEngine.setMusicVolume(vol);
    }

    /**
     * 停止
     */
    public stop(): void {
        if (!cc.audioEngine.isMusicPlaying) {
            return;
        }

        cc.audioEngine.stopMusic();

        if (this._fading) {
            this._fade.stop();
            cc.audioEngine.setMusicVolume(this._vol);
        }
    }

    /**
     * 暫停
     */
    public pause(): void {
        if (this.paused) {
            return;
        }

        this._paused = true;
        cc.audioEngine.pauseMusic();
    }

    /**
     * 續播
     */
    public resume(): void {
        if (!this._paused) {
            return;
        }

        this._paused = false;
        cc.audioEngine.resumeMusic();
    }

    /**
     * 播放
     * @param audio 音源
     * @param sec 音量漸變秒
     */
    public play(audio: cc.AudioClip, sec: number): void {
        if (audio == null) {
            console.warn(`play bgm failed, audio is null`);
            return;
        }

        sec = sec.limit(0, sec);

        // 執行播放
        let execute = () => {
            cc.audioEngine.playMusic(audio, true);
            this.fadeVol(sec, 0, 1);
        };

        // 漸變至無聲後播放
        if (cc.audioEngine.isMusicPlaying()) {
            this.fadeVol(sec, 1, 0, () => execute());
        } else {
            execute();
        }
    }

    /**
     * 音量漸變
     * @param sec 漸變秒數
     * @param from 開始音量(倍率)
     * @param to 結束音量(倍率)
     * @param done 漸變完成回調
     */
    private fadeVol(sec: number, from: number, to: number, done?: Function): void {
        // 舊的先停止
        this._fade?.stop();
        this._fading = false;

        // 執行變化
        let execute = (rate) => {
            let vol = (this._vol * rate).limit(0, 1);
            cc.audioEngine.setMusicVolume(vol);
        };

        // 漸變過程
        this._fade = cc.tween({ rate: from });
        this._fade.call(() => execute(from));
        this._fade.to(sec, { rate: to }, { onUpdate: curr => execute(curr) });

        // 漸變完成
        this._fade.call(() => {
            execute(to)
            done && done();

            this._fading = false;
        }, this);

        // 漸變開始
        this._fading = true;
        this._fade.start();
    }
}
