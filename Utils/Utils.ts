export default class Utils {

    /**
     * 返回二维内垂直于向量的向量
     * @param src 
     */
    public static GetVectorPerp(src: Laya.Vector2): Laya.Vector2 {
        return new Laya.Vector2(-src.y, src.x);
    }


    /**
     * 如果src是这个向量的顺时针方向，则返回正值;如果是逆时针方向，则返回负值(假设Y轴是向下的，X轴是向右的，就像一个窗口应用程序)
     * @param src 
     * @param beCompare 
     */
    public static VectorSign(src: Laya.Vector2, beCompare: Laya.Vector2): number {
        if (src.y * beCompare.x > src.x * beCompare.y) 
            return -1;
        else 
            return 1;
    }

    
    /**
     * 通过旋转矩阵获取偏移后的向量
     * @param rotationMatrix 
     * @param vec 
     */
    public static GetVecByRotationMatrix(rotationMatrix: Laya.Matrix3x3, vec: Laya.Vector2): Laya.Vector2 {
        let x = rotationMatrix.elements[0] * vec.x + rotationMatrix.elements[3] * vec.y + rotationMatrix.elements[6];
        let y = rotationMatrix.elements[1] * vec.x + rotationMatrix.elements[4] * vec.y + rotationMatrix.elements[7];
        return new Laya.Vector2(x, y);
    }

    /**
     * 弧度转角度
     * @param radius 
     */
    public static GetAngleByRadius(radius: number): number {
        return 180 * radius / Math.PI; 
    }

    /**
     * 限制向量大小
     * @param sourceSpeed 
     * @param max 
     */
    public static VectorTruncate(sourceSpeed: Laya.Vector2, max: number): Laya.Vector2 {
        if (Laya.Vector2.scalarLength(sourceSpeed) > max) {
            let out: Laya.Vector2 = new Laya.Vector2();
            Laya.Vector2.normalize(sourceSpeed, out);
            let maxVec2: Laya.Vector2 = new Laya.Vector2();
            Laya.Vector2.scale(out, max, maxVec2);
            return maxVec2;
        } 
        return sourceSpeed;
    }

    /**
     * 向量减法
     * @param start 
     * @param end 
     */
    public static Subvector2(start: Laya.Vector2, end: Laya.Vector2): Laya.Vector2 {
        return new Laya.Vector2(end.x - start.x, end.y - start.y);
    }

    /**
     * 向量取反
     * @param vec 
     */
    public static GetvectVerb(vec: Laya.Vector2): Laya.Vector2 {
        return new Laya.Vector2(-vec.x, -vec.y);
    }

    /**
     * 向量加法
     * @param start 
     * @param end 
     */
    public static Addvector2(start: Laya.Vector2, end: Laya.Vector2): Laya.Vector2 {
        return new Laya.Vector2(end.x + start.x, end.y + start.y);
    }

    /**
     * 加权平均数
     * @param valuse 
     */
    public static GetweightAverage(valuse: Array<number>): number {
        let t = 0;
        valuse.forEach(v => t += v);
        return t / valuse.length;
    }

}