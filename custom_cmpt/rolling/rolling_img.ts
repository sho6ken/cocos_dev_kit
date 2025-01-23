const { ccclass, property, requireComponent, menu } = cc._decorator;

/**
 * 貼圖循環滾動
 * @summary 寬高需為2的次方, 且圖片的warp mode改成repeat, 與material改用rolling_img.mtl
 */
@ccclass
@requireComponent(cc.Sprite)
@menu("custom cmpt/rolling img")
export class RollingImg extends cc.Component {
    /**
     * material
     */
    private declare _mtl: cc.Material;

    /**
     * x值速度
     */
    @property({ type: cc.Float, min: -1, max: 1 })
    public speedX: number = 0.3;

    /**
     * y值速度
     */
    @property({ type: cc.Float, min: -1, max: 1 })
    public speedY: number = 0.3;

    /**
     * x偏移量
     */
    private _offsetX: number = 0;

    /**
     * y偏移量
     */
    private _offsetY: number = 0;

    /**
     * 是否已停止播放
     */
    private _stopped: boolean = true;

    /**
     * 
     */
    protected onLoad(): void {
        this._mtl = this.getComponent(cc.Sprite).getMaterial(0);
    }

    /**
     * 
     */
    protected update(dt: number): void {
        if (this._stopped || this.node.active == false) {
            return;
        }

        this.updateX(dt);
        this.updateY(dt);
    }

    /**
     * 更新x值
     */
    private updateX(dt: number): void {
        if (this.speedX == 0) {
            return;
        }

        this._offsetX += (this.speedX * dt);

        if (this._offsetX > 1) {
            this._offsetX -= 1;
        } else if (this._offsetX < -1) {
            this._offsetX += 1;
        }

        this._mtl.setProperty("offsetX", this._offsetX);
    }

    /**
     * 更新y值
     */
    private updateY(dt: number): void {
        if (this.speedY == 0) {
            return;
        }

        this._offsetY += (this.speedY * dt);

        if (this._offsetY > 1) {
            this._offsetY -= 1;
        } else if (this._offsetY < -1) {
            this._offsetY += 1;
        }

        this._mtl.setProperty("offsetY", this._offsetY);
    }

    /**
     * 開始播放
     */
    public play(): void {
        this._stopped = false;
    }

    /**
     * 停止播放
     */
    public stop(): void {
        this._stopped = true;
    }
}
