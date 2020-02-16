/*
  @author long 
  @desc 2维向量
  @date 2018-05-16 14:52:48 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 17:24:35
 */
class Vector2 extends egret.Point {
    public constructor(x?: number, y?: number) {
        super(x, y);
    }

    /**
     * 返回 pt1 和 pt2 之间的距离。
     * @param p1 第一个点
     * @param p2 第二个点
     * @returns 第一个点和第二个点之间的距离。
     */
    public static distance(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }

    /** 加法 */
    public add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    /** 向量乘标量 */
    public multiply(v: number): Vector2 {
        return new Vector2(this.x * v, this.y * v);
    }

    /** 减法 */
    public subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    /** 点积 */
    public dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    /** 获取该向量到另外一个向量的角度，区分正负，顺时针为正 */
    public getAngleWith(v: Vector2): number {
        let angle = Math.acos(this.dot(v) / (this.length * v.length)) * 180 / Math.PI;
        let aVect2 = this.clone();
        aVect2.normalize(1);
        aVect2 = aVect2.rotate(angle);
        let bVect2 = v.clone();
        bVect2.normalize(1);
        if (aVect2.equals(bVect2)) {
            return angle;
        } else {
            return -angle;
        }
    }

    public globalToLocal(object: egret.DisplayObject): Vector2 {
        if (object && object.parent) {
            let pt = object.parent.globalToLocal(this.x, this.y);
            this.x = pt.x;
            this.y = pt.y;
        }
        return this;
    }

    public localToGlobal(object: egret.DisplayObject): Vector2 {
        let pt = object.localToGlobal(this.x, this.y);
        this.x = pt.x;
        this.y = pt.y;
        return this;
    }

    // public getAngleWith(v: Vector2) {//获取该向量和另外一个向量的角度，区分正负，顺时针为正，
    //     var angle = Math.acos(this.dotMul(v) / (this.getMod() * v.getMod())) * 180 / Math.PI;
    //     if (this.clone().normalize().rotate(angle).equals(v.clone().normalize())) {
    //         return angle;
    //     }
    //     else {
    //         return -angle;
    //     }
    // }

    public equals(v: Vector2): boolean {
        return Vector2.isEqual(this.x, v.x) && Vector2.isEqual(this.y, v.y);
        //斜边上会错误  x相差-xx  y相差+xx  最后算的相等 体现在摇杆右上角松手不会停止移动
        // return Math.abs(this.x - v.x + this.y - v.y) < 0.001;
    }

    public set length(v: number) {//设置向量长度
        this.normalize(1);
        this.x *= v;
        this.y *= v;
    }

    public get length(): number {
        return egret.superGetter(Vector2, this, "length");
    }

    /** 向量旋转 */
    public rotate(angle: number): Vector2 {
        angle *= (Math.PI / 180);
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector2(x, y);
    }

    public normalizeVector() {
        let v = new Vector2();
        let m = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        if (m != 0) {
            v.x = this.x / m;
            v.y = this.y / m;
        }
        return v;
    }

    /** 两向量夹角 不区分正负 */
    public static angle(start: Vector2, end: Vector2): number {
        // let diff_x = end.x - start.x,
        //     diff_y = end.y - start.y;
        // //返回角度,不是弧度
        let rate = start.dot(end) / (start.length * end.length);
        let absRate = Math.abs(rate);
        if (Vector2.isEqual(absRate, 1, 0.0000001)) {
            rate = 1 * rate / absRate;
        }
        return Math.acos(rate) * 180 / Math.PI;
    }

    public static interpolate(pt1: Vector2, pt2: Vector2, f: number): Vector2 {
        let f1: number = 1 - f;
        return new Vector2(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
    }

    public static polar(len: number, angle: number): Vector2 {
        return new Vector2(len * egret.NumberUtils.cos(angle / DEG_TO_RAD), len * egret.NumberUtils.sin(angle / DEG_TO_RAD));
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public static get Zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public static get Right(): Vector2 {
        return new Vector2(1, 0);
    }

    public static get Left(): Vector2 {
        return new Vector2(-1, 0);
    }

    public static get Up(): Vector2 {
        return new Vector2(0, -1);
    }

    public static get Down(): Vector2 {
        return new Vector2(0, 1);
    }

    /**判断浮点型是否相等 */
    public static isEqual(num1: number, num2: number, errorValue = 0.00001): boolean {
        return Math.abs(num1 - num2) < errorValue;
    }
}


