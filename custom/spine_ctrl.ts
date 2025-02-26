import { WaitUtil } from "../utility/wait_util";

const { ccclass, property, requireComponent, menu, disallowMultiple } = cc._decorator;

/**
 * spine動畫事件
 * @param name 事件名稱
 */
export type SpinAnimEvent = (name: string) => void;

/**
 * spine控制
 */
@ccclass
@disallowMultiple
@requireComponent(sp.Skeleton)
@menu(`custom/spine_ctrl`)
export class SpineCtrl extends cc.Component {
    /**
     * spine anim track
     */
    public static readonly TRACK = 99;

    /**
     * spine
     */
    private declare _spine: sp.Skeleton;

    /**
     * 
     */
    protected onLoad(): void {
        this._spine = this.getComponent(sp.Skeleton); 
    }

    /**
     * 初始化
     * @param data 骨骼資料
     */
    public init(data: sp.SkeletonData): void {
        this._spine.skeletonData = data;
    }

    /**
     * 設定播放動畫速度
     */
    public setSpeed(value: number): void {
        this._spine.timeScale = value;
    }

    /**
     * 停止播放
     */
    public stop(): void {
        this._spine.clearTrack(SpineCtrl.TRACK);
        this._spine.setToSetupPose();
        this.resume();
    }

    /**
     * 暫停播放
     */
    public pause(): void {
        this._spine.paused = true;
    }

    /**
     * 恢復播放
     */
    public resume(): void {
        this._spine.paused = false;
    }

    /**
     * 單次播放
     * @param key 動畫名稱
     * @param event 動畫事件回調
     */
    public async play(key: string = this._spine.defaultAnimation, event?: SpinAnimEvent): Promise<void> {
        this.stop();

        let entry = this._spine.setAnimation(SpineCtrl.TRACK, key, false);
        this.listen(entry, event);

        return new Promise(async resolve => {
            await WaitUtil.waitSec(entry.animation.duration, this._spine);
            resolve();
        });
    }

    /**
     * 循環播放
     * @param key 動畫名稱
     * @param event 動畫事件回調
     */
    public playLoop(key: string = this._spine.defaultAnimation, event?: SpinAnimEvent): void {
        this.stop();

        let entry = this._spine.setAnimation(SpineCtrl.TRACK, key, true);
        this.listen(entry, event);
    }

    /**
     * 循序播放
     * @param keys 動畫名稱列表
     * @param event 動畫事件回調
     * @summary 會依照順序播放動畫
     */
    public playSteps(keys: string[], event?: SpinAnimEvent): Promise<void> {
        this.stop();

        let time = 0;

        // 計算播放所有動畫所需時間
        keys.forEach(key => {
            let entry = this._spine.setAnimation(SpineCtrl.TRACK, key, false);
            this.listen(entry, event);

            time += entry.animation.duration;
        }, this);

        // 等待所有動畫播放
        if (time > 0) {
            return new Promise(async resolve => {
                await WaitUtil.waitSec(time, this._spine);
                resolve();
            });
        }
    }

    /**
     * 聽間動畫事件
     * @param event 動畫事件回調
     */
    private listen(entry: sp.spine.TrackEntry, event: SpinAnimEvent): void {
        if (entry == null || event == null) {
            console.warn(`${this._spine.name} listen spine event failed`);
            return;
        }

        this._spine.setTrackEventListener(entry, (entry, event) => event(event.data.name));
    }

    /**
     * 將物件綁定骨骼
     * @param bone 骨骼名稱
     * @param node 被綁的物件
     * @summary 將該物件設定成此骨骼的子物件
     */
    public bindBone(bone: string, node: cc.Node): void {
        // @ts-ignore
        let nodes = this._spine.attachUtil.generateAttachedNodes(bone);

        if (nodes && nodes.length > 0) {
            node.parent = nodes[0];
        }
    }
}
