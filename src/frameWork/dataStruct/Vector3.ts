/**
 * @author 雪糕 
 * @desc 3维坐标
 * @date 2018-05-11 16:03:57 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 21:32:12
 */
class Vector3 {
    static create(x: number = 0, y: number = 0, z: number = 0): Vector3 {
        return new Vector3(x, y, z);
    }

    static get zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    public x: number;
    public y: number;
    public z: number;

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**求两个向量距离 */
    public static distance(a: Vector3, b: Vector3): number {
        if (!a || !b) {
            lanbo.logger.error(LOG_TAG.FrameWork, `Vector3->distance() parm is null a=${a}`);
            return 0;
        }

        let dir = a.subtract(b);
        return dir.length;
    }

    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * 规范化
     * @param thickness 目标长度
     * @param is2D 咱不用
     */
    public normalize(thickness: number): void {
        if (this.x != 0 || this.y != 0) {
            let relativeThickness: number = thickness / this.length;
            this.x *= relativeThickness;
            this.y *= relativeThickness;
            this.z *= relativeThickness;
        }
    }

    /** 加法 */
    public add(v: Vector3 | Vector2): Vector3 {
        if (v instanceof Vector3) {
            return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
        } else {
            return new Vector3(this.x + v.x, this.y + v.y, this.z);
        }
    }

    /* 减法 */
    public subtract(v: Vector3 | Vector2): Vector3 {
        if (v instanceof Vector3) {
            return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
        } else {
            return new Vector3(this.x - v.x, this.y - v.y, this.z);
        }
    }

    /* 向量乘标量 */
    public multiply(v: number): Vector3 {
        return new Vector3(this.x * v, this.y * v, this.z * v);
    }

    public equals(v: Vector3): boolean {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    public toString(): string {
        return "(x=" + this.x + ", y=" + this.y + ", z=" + this.z + ")";
    }

    public globalToLocal(object: egret.DisplayObject): Vector3 {
        if (object && object.parent) {
            let pt = object.parent.globalToLocal(this.x, this.y);
            this.x = pt.x;
            this.y = pt.y;
        }
        return this;
    }

    /**
     * 本地坐标转成全局坐标
     * @param object 相对坐标系 在该物体下的坐标值转换  如果是实体坐标变全局 需要给定实体的父节点即实体所在坐标系
     */
    public localToGlobal(object: egret.DisplayObject): Vector3 {
        let pt = object.localToGlobal(this.x, this.y);
        this.x = pt.x;
        this.y = pt.y;
        return this;
    }

    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /* 二维化 */
    public getVector2() {
        return new Vector2(this.x, this.y);
    }
}