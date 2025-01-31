import { AssetLoadOpt } from "./asset_data";

/**
 * 資料夾加載器
 */
export class FolderLoader {
    /**
     * 加載
     * @param type 資源種類
     * @param opt 加載資源參數
     * @summary 非bundle則從resources中取得
     */
    public async load<T extends cc.Asset>(type: typeof cc.Asset, opt: AssetLoadOpt): Promise<{ assetPath: string, asset: T }[]> {
        return new Promise((resolve, reject) => {
            let loader = opt.bundlePath ? cc.assetManager.getBundle(opt.bundlePath) : cc.resources;

            if (!loader) {
                console.warn(`load folder ${opt.path} failed, loader is null`, opt.bundlePath, type.name);
                return;
            }

            loader.loadDir(opt.path, type, (err, assets) => {
                if (err) {
                    console.error(`load folder ${opt.path} failed`, opt.bundlePath, type.name, err);
                    reject(err);
                }

                let info = loader.getDirWithPath(opt.path, type);
                let res = [];

                assets.forEach((asset, idx) => {
                    res.push({ assetPath: info[idx].path, asset: asset as T });
                });

                resolve(res);
            });
        }); 
    }
}
