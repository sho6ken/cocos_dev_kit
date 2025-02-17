import { WorkChain } from "./work_chain";

/**
 * 結果工作鏈
 * @summary 依執行成功或失敗來決定後續執行行為
 */
export abstract class ResChain {
    /**
     * 成功鏈
     */
    private declare _succeed: WorkChain;

    /**
     * 失敗鏈
     */
    private declare _failed: WorkChain;

    /**
     * 設定執行結果行為
     * @param succeed 成功鏈
     * @param failed 失敗鏈
     */
    public set(succeed: WorkChain, failed: WorkChain): void {
        this._succeed = succeed;
        this._failed = failed;
    }

    /**
     * 執行
     * @returns 是否全鏈正常執行完畢
     */
    public async execute(...params: any): Promise<boolean> {
        if (!this._succeed || !this._failed) {
            return false;
        }

        let res = await this.business(...params);
        let chain = res ? this._succeed : this._failed;
        
        return chain.execute(...params);
    }

    /**
     * 自身的業務
     */
    protected abstract business(...params: any[]): Promise<boolean>;
}
