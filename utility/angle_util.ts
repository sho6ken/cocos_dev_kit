/**
 * 角度計算
 */
export class AngleUtil {
    /**
     * 角度轉弧度
     */
    public static toRadian(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**
     * 弧度轉角度
     */
    public static toAngle(radian: number): number {
        return radian * 180 / Math.PI;
    }

    /**
     * 角度取sin
     */
    public static angleSin(angle: number): number {
        return Math.sin(this.toRadian(angle));
    }

    /**
     * 角度取cos
     */
    public static angleCos(angle: number): number {
        return Math.cos(this.toRadian(angle));
    }

    /**
     * 兩向量取夾角
     */
    public static vecAngle(v1: cc.Vec2 | cc.Vec3, v2: cc.Vec2 | cc.Vec3): number {
        return this.toAngle(cc.v2(v2.x, v2.y).signAngle(cc.v2(v1.x, v1.y)));
    }
}
