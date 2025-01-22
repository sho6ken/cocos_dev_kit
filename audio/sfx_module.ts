import { SingleObj } from "../singleton/single_obj";

/**
 * 音效模塊
 */
export class SfxModule implements SingleObj {
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
    private get vol(): number { return this._vol; }

    /**
     * 是否已暫停
     */
    private declare _paused: boolean;

    /**
     * 是否已暫停
     */
    public get paused(): boolean { return this._paused; }

    /**
     * 初始化
     */
    public init(): void {
        this._vol = cc.audioEngine.getEffectsVolume();
        this._paused = false;
    }

    /**
     * 關閉
     */
    public close(): void {
        this.stop();
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
        cc.audioEngine.setEffectsVolume(vol);
    }

    /**
     * 停止
     */
    public stop(): void {
        cc.audioEngine.stopAllEffects();
    }

    /**
     * 暫停
     */
    public pause(): void {
        if (this.paused) {
            return;
        }

        this._paused = true;
        cc.audioEngine.pauseAllEffects();
    }

    /**
     * 續播
     */
    public resume(): void {
        if (!this._paused) {
            return;
        }

        this._paused = false;
        cc.audioEngine.resumeAllEffects();
    }

    /**
     * 播放
     * @param audio 音源
     * @param done 播畢回調
     * @summary 強制為非循環播放
     */
    public play(audio: cc.AudioClip, done?: Function): void {
        if (audio == null) {
            console.warn(`play sfx failed, audio is null`);
            return;
        }

        let id = cc.audioEngine.playEffect(audio, false);
        
        // 播畢回調
        done && cc.audioEngine.setFinishCallback(id, done);
    }
}
