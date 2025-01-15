/**
 * 陣列擴充
 */
interface Array<T> {
    /**
     * 有無此物件
     */
    has(item: T): boolean;

    /**
     * 物件互換
     * @param from 起點位置
     * @param to 終點位置
     */
    swap(from: number, to: number): boolean;

    /**
     * 物件位移
     * @param from 起點位置
     * @param to 終點位置
     */
    move(from: number, to: number): boolean;

    /**
     * 刪除物件
     */
    delete(item: T): boolean;

    /**
     * 陣列洗牌
     */
    shuffle(): void;

    /**
     * 隨機一個物件
     */
    random(): T;

    /**
     * 去除重複的物件
     * @returns 新陣列
     */
    nonrepeat(): T[];
}

/**
 * 
 */
Array.prototype.has = function<T>(this: Array<T>, item: T): boolean {
    return this.indexOf(item) != -1;
}

/**
 * 
 */
Array.prototype.swap = function<T>(this: Array<T>, from: number, to: number): boolean {
    let len = this.length;

    if (from == to || (from < 0 || from >= len) || (to < 0 || to >= len)) {
        return false;
    }

    [this[from], this[to]] = [this[to], this[from]];
    return true;
}

/**
 * 
 */
Array.prototype.move = function<T>(this: Array<T>, from: number, to: number): boolean {
    let len = this.length;

    if (from == to || (from < 0 || from >= len) || (to < 0 || to >= len)) {
        return false;
    }

    this.splice(to, 0, this.splice(from, 1)[0]);
    return true;
}

/**
 * 
 */
Array.prototype.delete = function<T>(this: Array<T>, item: T): boolean {
    let idx = this.indexOf(item);

    if (idx == -1) {
        return false;
    }

    this.splice(idx, 1);
    return true;
}

/**
 * 
 */
Array.prototype.shuffle = function<T>(this: Array<T>): void {
    let len = this.length;

    for (let i = 0; i < len; i++) {
        this.swap(i, Math.floor(Math.random() * len));
    }
}

/**
 * 
 */
Array.prototype.random = function<T>(this: Array<T>): T {
    return this[Math.floor(Math.random() * this.length)];
}

/**
 * 
 */
Array.prototype.nonrepeat = function<T>(this: Array<T>): T[] {
    let res = [this[0]];

    for (const from of this) {
        let repeated = false;

        for (const to of res) {
            if (from == to) {
                repeated = true;
                break;
            }
        }

        if (repeated == false) {
            res.push(from);
        }
    }

    return res;
}
