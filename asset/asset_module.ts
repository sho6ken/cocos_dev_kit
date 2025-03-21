import { SingleObj } from "../singleton/single_obj";
import { AssetLoadOpt } from "./asset_data";
import { AssetLoader } from "./asset_loader";
import { BundleLoader } from "./bundle_loader";
import { FolderLoader } from "./folder_loader";

/**
 * 資源模塊
 */
export class AssetModule implements SingleObj {
    /**
     * 名稱
     */
    public get name(): string { return this.constructor.name; }

    /**
     * 資源加載器
     */
    private declare _asset: AssetLoader;

    /**
     * bundle加載器
     */
    private declare _bundle: BundleLoader;

    /**
     * 資料夾加載器
     */
    private declare _folder: FolderLoader;

    /**
     * 初始化
     */
    public init(): void {
        this._asset = new AssetLoader();
        this._bundle = new BundleLoader();
        this._folder = new FolderLoader();
    }

    /**
     * 關閉
     */
    public close(): void {
        this._asset.close();
        this._asset = null;

        this._bundle.close();
        this._bundle = null;

        this._folder = null;
    }

    /**
     * 清除閒置資源
     */
    public clearAsset(): void {
        this._asset.clear();
    }

    /**
     * 清除bundle
     * @param path bundle路徑
     */
    public clearBundle(path: string): void {
        this._bundle.clear(path);
    }

    /**
     * 取得資源
     * @param type 資源種類
     * @param opt 加載資源參數
     * @summary 如果資源在bundle內, 則需先加載bundle後再取得資源
     */
    public async getAsset<T extends cc.Asset>(type: typeof cc.Asset, opt: AssetLoadOpt): Promise<T> {
        return await this._asset.get(type, opt);
    }

    /**
     * 加載bundle
     * @param path bundle路徑
     */
    public async loadBundle(path: string): Promise<void> {
        await this._bundle.load(path);
    }

    /**
     * 加載資料夾
     * @param type 資源種類
     * @param opt 加載資源參數
     */
    public async loadFolder(type: typeof cc.Asset, opt: AssetLoadOpt): Promise<void> {
        let list = await this._folder.load(type, opt);

        list.forEach(elm => {
            this._asset.add(elm.asset, elm.assetPath, opt.hold);
        }, this);
    }

    /**
     * 打印資訊
     */
    public print(): void {
        console.group(`dump asset module contain`);

        this._asset.print();
        this._bundle.print();

        console.groupEnd();
    }
}
