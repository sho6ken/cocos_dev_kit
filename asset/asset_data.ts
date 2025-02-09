/**
 * 資源資料
 */
export interface AssetData {
    /**
     * 資源
     */
    asset: cc.Asset;

    /**
     * 常駐物件
     * @summary 不會因閒置被釋放
     */
    hold?: boolean;

    /**
     * 逾期時間
     */
    expire?: number;
}

/**
 * 加載資源參數
 */
export interface AssetLoadOpt {
    /**
     * 加載路徑
     */
    path: string;

    /**
     * bundle路徑
     */
    bundlePath?: string;

    /**
     * 是否常駐不釋放
     */
    hold: boolean;
}
