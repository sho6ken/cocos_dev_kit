/**
 * json處理
 */
export class JsonUtil {
    /**
     * json轉map
     * @param src json字串
     */
    public static toMap<TK, TV>(src: string): Map<TK, TV> {
        // 轉換
        const exchange = function(json: {}): Map<TK, TV> {
            let res = new Map<TK, TV>();

            for (const key in json) {
                res.set(<TK>key, <TV>json[key]);
            }

            return res;
        }

        return exchange(JSON.parse(src));
    }

    /**
     * map轉json字串
     */
    public static fromMap(src: Map<any, any>): string {
        // 轉換
        const exchange = function(src: Map<any, any>): {} {
            let res = {};
            src.forEach((value, key) => res[key] = value);
            return res;
        }

        return JSON.stringify(exchange(src));
    }
}
