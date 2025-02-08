/**
 * bundle加載器
 */
export class BundleLoader {
    /**
     * 已加載bundle
     */
    private declare _bundles: Map<string, cc.AssetManager.Bundle>;

    /**
     * 
     */
    constructor() {
        this._bundles = new Map();
    }

    /**
     * 關閉
     */
    public close(): void {
        Array.from(this._bundles.keys()).forEach(path => this.clear(path), this);
        this._bundles.clear();
    }

    /**
     * 清除bundle
     * @param path bundle路徑
     */
    public clear(path: string): void {
        if (!this._bundles.has(path)) {
            return;
        }

        let bundle = this._bundles.get(path);
        bundle.releaseAll();
        cc.assetManager.removeBundle(bundle);
        this._bundles.delete(path);
    }

    /**
     * 加載bundle
     * @param path bundle路徑
     */
    public async load(path: string): Promise<cc.AssetManager.Bundle> {
        if (this._bundles.has(path)) {
            return this._bundles.get(path);
        }

        return new Promise((resolve, reject) => {
            cc.assetManager.loadBundle(path, (err, bundle) => {
                if (err) {
                    console.error(`load bundle ${path} failed`, err);
                    reject();
                }

                this._bundles.set(path, bundle);
                resolve(bundle);
            });
        });
    }

    /**
     * 打印資訊
     */
    public print(): void {
        console.table(this._bundles.keys());
    }
}
