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
