/**
 * 工作鏈
 */
export abstract class WorkChain {
    /**
     * 子鏈
     */
    private _next: WorkChain = null;

    /**
     * 加入
     * @param chain 將此鏈加入子鏈
     * @returns 實際上被此鏈加入的父鏈
     * @summary 已有子鏈時則加入子鏈的子鏈
     */
    public push(chain: WorkChain): WorkChain {
        if (this._next) {
            return this._next.push(chain);
        } else {
            this._next = chain;
            return this;
        }
    }

    /**
     * 插入
     * @param chain 將此鏈插入子鏈
     * @returns 原本的子鏈
     * @summary 將原本的父子鏈斷開並從中插入此鏈
     */
    public insert(chain: WorkChain): WorkChain | null {
        chain._next = this._next;
        this._next = chain;
        return chain._next;
    }

    /**
     * 執行
     * @returns 是否全鏈正常執行完畢
     */
    public async execute(...params: any[]): Promise<boolean> {
        if (!await this.business(...params)) {
            return false;
        }

        return this._next ? await this._next.execute(...params) : true;
    }

    /**
     * 自身的業務
     */
    protected abstract business(...params: any[]): Promise<boolean>;
}
