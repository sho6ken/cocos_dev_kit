/**
 * 數字擴充
 */
interface Number {
    /**
     * 限制數字範圍
     * @param min 最小值(含)
     * @param max 最大值(含)
     */
    limit(min: number, max: number): number;

    /**
     * 是否在兩值間
     * @param min 最小值(含)
     * @param max 最大值(含)
     */
    between(min: number, max: number): boolean;

    /**
     * 轉成美式數字
     * @example
     * 123456789 => 123,456,789
     */
    permille(): string;

    /**
     * 轉成帶符號數字
     * @param fixed 小數位數
     * @example
     * // .47是未滿.01的部分會做進位處理
     * 123456 => 123.47K
     * 123456789 => 123.47M
     */
    thousand(): string;
}

/**
 * 
 */
Number.prototype.limit = function(this: number, min: number, max: number): number {
    let value = this.valueOf();
    return value >= max ? max : (value <= min ? min : value);
}

/**
 * 
 */
Number.prototype.between = function(this: number, min: number, max: number): boolean {
    let value = this.valueOf();
    return value >= min && value <= max;
}

/**
 * 
 */
Number.prototype.permille = function(this: number): string {
    return this.valueOf().toLocaleString();
}

/**
 * 
 */
Number.prototype.thousand = function(this: number): string {
    const k = 1000;

    let value = this.valueOf();

    if (value < k) {
        return value.toString();
    }

    const symbols = [``, `K`, `M`, `G`];
    
    let idx = Math.floor(Math.log(value) / Math.log(k));
    let num = value / Math.pow(k, idx);

    return num.toFixed(2) + symbols[idx];
}
