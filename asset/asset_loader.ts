import { AssetData, AssetLoadOpt } from "./asset_data";

/**
 * 資源加載器
 */
export class AssetLoader {
    /**
     * 使用中資源
     */
    private declare _assets: Map<string, AssetData>;

    /**
     * 現在時間
     */
    private get _now(): number { return Date.now() / 1000; } 

    /**
     * 逾期時間
     */
    private get _expire(): number { return this._now + (5 * 60); }

    /**
     * 
     */
    constructor() {
        this._assets = new Map();
    }

    /**
     * 關閉
     */
    public close(): void {
        this._assets.forEach(data => data.asset = null);
        this._assets.clear();
    }

    /**
     * 清除閒置資源
     */
    public clear(): void {
        let keys = [];

        this._assets.forEach((data, key) => {
            if (data && !data.hold && data.expire < this._now) {
                keys.push(key);
            }
        });

        keys.forEach(key => {
            this._assets[key].asset = null;
            this._assets.delete(key);
        });
    }

    /**
     * 取得資源
     * @param type 資源種類
     * @param opt 加載資源參數
     * @summary 如果資源在bundle內, 則需先加載bundle後再取得資源
     */
    public async get<T extends cc.Asset>(type: typeof cc.Asset, opt: AssetLoadOpt): Promise<T> {
        if (this._assets.has(opt.path)) {
            let data = this._assets.get(opt.path);
            data.expire = this._expire;

            return data.asset as T;
        }

        let asset = await this.load(type, opt);
        this.add(asset, opt.path, opt.hold);

        return asset as T;
    }

    /**
     * 加載
     * @param type 資源種類
     * @param opt 加載資源參數
     * @summary 非bundle則從resources中取得
     */
    private async load<T extends cc.Asset>(type: typeof cc.Asset, opt: AssetLoadOpt): Promise<T> {
        return new Promise((resolve, reject) => {
            let loader = opt.bundlePath ? cc.assetManager.getBundle(opt.bundlePath) : cc.resources;

            if (!loader) {
                console.warn(`load asset ${opt.path} failed, loader is null`, opt.bundlePath, type.name);
                return;
            }

            loader.load(opt.path, type, (err, asset) => {
                if (err) {
                    console.error(`load asset ${opt.path} failed`, opt.bundlePath, type.name, err);
                    reject(err);
                }

                resolve(asset as T);
            });
        });
    }

    /**
     * 新增資源
     * @param asset 資源
     * @param path 加載路徑
     * @param hold 是否常駐
     */
    public add<T extends cc.Asset>(asset: T, path: string, hold: boolean): void {
        let data = { asset: asset, hold: hold, expire: this._expire };
        this._assets.set(path, data);
    }

    /**
     * 打印資訊
     */
    public print(): void {
        console.table(this._assets.keys());
    }
}
