/**
 * 物件複製
 */
export class CopyUtil {
    /**
     * 淺拷貝
     */
    public static copy<T>(src: T): T {
        if (src == null || typeof src != `object` || src instanceof RegExp) {
            return null;
        }

        return Object.assign({}, src);
    }

    /**
     * 深拷貝
     */
    public static copyDeep<T>(src: T): T {
        if (src == null || typeof src != `object` || src instanceof RegExp) {
            return null;
        }

        let res = null;

        if (Array.isArray(src)) {
            res = [];

            for (let value of src) {
                res.push(this.copyDeep(value));
            }
        } 
        else {
            res = {};

            for (let key in src) {
                res[key] = this.copyDeep(src[key]);
            }
        }

        return res;
    }
}
