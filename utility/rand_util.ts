/**
 * 隨機工具
 */
export class RandUtil {
    /**
     * 用種子取亂數
     * @returns 0~1
     */
    public static randBySeed(seed: number): number {
        if (seed <= 0) {
            seed = Date.now();
        }

        return (seed * 16807) % 2147483647 / 2147483647;
    }

    /**
     * 隨機整數
     * @param max 最大值(不含)
     * @param min 最小值(含)
     */
    public static randInt(max: number, min: number = 0): number {
        max = Math.floor(max);
        min =  Math.ceil(min);
        return Math.floor(this.randFloat(max, min));
    }

    /**
     * 隨機浮點數
     * @param max 最大值(不含)
     * @param min 最小值(含)
     */
    public static randFloat(max: number, min: number = 0): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 隨機百分比
     * @returns 是否小於(不含)此值
     */
    public static randPercent(value: number): boolean {
        return value < this.randFloat(100);
    }

    /**
     * 隨機權重
     * @param weights 權重列表
     * @returns 列表索引, -1代表失敗
     */
    public static randWeights(weights: number[]): number {
        let len = weights.length;

        if (len <= 0) {
            return -1;
        }

        // 加總
        let sum = 0;
        weights.forEach(weight => sum += weight);

        let rand = this.randFloat(sum);
        let curr = 0;

        // 計算
        for (let i = 0; i < len; i++) {
            curr += weights[i];

            if (curr > rand) {
                return i;
            }
        }

        return -1;
    }
}
