const { ccclass, property, requireComponent, menu, disallowMultiple } = cc._decorator;

/**
 * 物件震動
 */
@ccclass
@disallowMultiple
@menu(`custom/shake_obj`)
export class ShakeObj extends cc.Component {
    /**
     * 震動幅度
     */
    @property({ type: cc.Float, min: 0.01 })
    private power: number = 5;

    /**
     * 單次位移時間
     */
    @property({ type: cc.Float, min: 0.01 })
    private sec: number = 0.16;

    /**
     * 晃動複雜度
     */
    @property({ type: cc.Integer, min: 2 })
    private complex: number = 8;

    /**
     * tween
     */
    private declare _tween: cc.Tween;

    /**
     * 震動
     * @param count 震動次數
     */
    public async shake(count: number = 5): Promise<void> {
        // 參數錯誤
        if (count <= 1 || this.power <= 0 || this.sec <= 0) {
            return;
        }

        // 震動中
        if (this._tween) {
            return;
        }

        let list = this.range();

        // 至少要有2個點才能跳動
        if (list.length > 1) {
            return new Promise(resolve => {
                this._tween = cc.tween(this.node);
    
                // -1是讓最後一動要回到原位
                for (let i = 0; i < count - 1; i++) {
                    this._tween.to(this.sec, { position: list.random() });
                }
    
                this._tween.to(this.sec, { position: cc.Vec3.zero });
                this._tween.call(() => resolve());
                this._tween.start();
            });
        }
    }

    /**
     * 取得震動範圍
     */
    private range(): cc.Vec3[] {
        let res = [];

        for (let i = 1; i <= this.complex; i++) {
            let vec = cc.v2(0, this.power).rotate(Math.PI / 4 * (i * 3));
            res.push(cc.v3(vec.x, vec.y, 0));
        }

        return res;
    }
}