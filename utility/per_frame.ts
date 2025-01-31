/**
 * 分幀處理
 * @summary 防止同時間大量執行時造成卡頓
 */
export abstract class PerFrame {
    /**
     * 檢查間隔
     */
    protected _interval: number = 300;

    /**
     * 執行
     * @param count 總執行次數
     */
    public async execute(count: number): Promise<void> {
        let tag = `rec per frame ${this.constructor.name} spend tiem`;
        console.time(tag);

        await this.doPerFrame(this.generator(count));

        console.timeEnd(tag);
    }

    /**
     * 生成器
     * @param count 總執行次數
     * @summary es6的協程處理功能, 函式前要加*號做區別
     */
    private *generator(count: number): Generator {
        for (let i = 0; i < count; i++) {
            yield this.business(i);
        }
    }

    /**
     * 分幀處理
     * @param generator 生成器
     */
    private async doPerFrame(generator: Generator): Promise<void> {
        return new Promise(resolve => {
            // 處理
            let play = function(): void {
                let begin = this._now;

                for (let iter = generator.next();; iter = generator.next()) {
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }

                    // 逾時就等下幀再檢查是否執行完畢
                    if (this._now - begin >= this.interval) {
                        this.scheduleOnce(() => play());
                    }
                }
            }.bind(this);

            // 開始
            play();
        });
    }

    /**
     * 實際業務邏輯
     * @param count 當前執行次數
     */
    protected abstract business(count: number): void;
}
