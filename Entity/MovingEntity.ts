import GameWorld from "../GameWorld/GameWorld";
import BaseGameEntity, { Entity_Type } from "./BaseGameEntity";
import Utils from "../Utils/Utils";

export default class MovingEntity extends BaseGameEntity {
    
    /** 当前实体的移动速度 */
    private m_vVelocity: Laya.Vector2;
    public get Velocity(): Laya.Vector2 {
        return this.m_vVelocity;
    }
    public set Velocity(v: Laya.Vector2) {
        this.m_vVelocity = v;
    }

    /** 当前实体的朝向 */
    private m_vHeading: Laya.Vector2;
    public get vHeading(): Laya.Vector2 {
        return this.m_vHeading;
    }
    public set vHeading(v: Laya.Vector2) {
        // 检查给定的方向是不是长度为零的向量
        if (v.x * v.x + v.y * v.y - 1 < 0.000001) {
            console.error("方向的标量必须大于1");
            return;
        }
        this.m_vHeading = v;
        this.m_vSide = Utils.GetVectorPerp(v);
    }

    /** 垂直于当前朝向的向量 */
    private m_vSide: Laya.Vector2;
    public get vSide(): Laya.Vector2 {
        return this.m_vSide;
    }
    public set vSide(v: Laya.Vector2) {
        this.m_vSide = v;
    }

    /** 物体质量 */
    private m_Mass: number;
    public get Mass(): number {
        return this.m_Mass;
    }
    public set Mass(v: number) {
        this.m_Mass = v;
    }

    /** 物体最大速度 */
    private m_dMaxSpeed: number;
    public get MaxSpeed(): number {
        return this.m_dMaxSpeed;
    }
    public set MaxSpeed(v: number) {
        this.m_dMaxSpeed = v;
    }

    /** 物体受到的最大力(推力) */
    private m_dMaxForce: number;
    public get MaxForce(): number {
        return this.m_dMaxForce;
    }
    public set MaxForce(v: number) {
        this.m_dMaxForce = v;
    }

    /** 物体单帧所能承受的最大旋转值(旋转速度 弧度/s ) */
    private m_dMaxTurnRate: number;
    public get MaxTurnRate(): number {
        return this.m_dMaxTurnRate;
    }
    public set MaxTurnRate(v: number) {
        this.m_dMaxTurnRate = v;
    }


    /**
     * 移动实体构造器
     * @param velocity 速度(向量)
     * @param max_speed 最大速度
     * @param heading 朝向
     * @param mass 质量
     * @param turn_rate 最大旋转 
     * @param max_force 最大推力
     * @param position 位置
     * @param radius 可视半径
     * @param scale 缩放比例 vector2
     */
    constructor(
        velocity: Laya.Vector2,
        max_speed: number, 
        heading: Laya.Vector2, 
        mass: number,
        turn_rate: number,
        max_force: number,
        position?: Laya.Vector2,
        radius?: number,
        scale?: Laya.Vector2
    ) {
        super(BaseGameEntity.NextValidId(), Entity_Type.MoveEntity, radius, position, scale);
        this.m_vVelocity = velocity;
        this.m_dMaxSpeed = max_speed;
        this.m_vHeading = heading;
        this.m_Mass = mass;
        this.m_dMaxTurnRate = turn_rate;
        this.m_dMaxForce = max_force;
    }

    /**
     * 给定目标位置，此方法旋转实体的航向和侧向量的值(不大于实体所能承受的最大扭力)，直到它直接面对目标
     * @param target 目标朝向(归一化向量)
     */
    public RotationHeadingToFacePosition(target: Laya.Vector2): boolean {
        // 获取纠正向量方向
        let toTarget: Laya.Vector2 = new Laya.Vector2(target.x - this.m_vHeading.x, target.y - this.m_vHeading.y);
        let tempRedressForce = new Laya.Vector2();
        Laya.Vector2.normalize(toTarget, tempRedressForce);

        // 确定当前朝向与纠正向量的夹角(及当前实体为了朝向目标需要旋转的夹角)
        let radius: number = Math.acos(Laya.Vector2.dot(this.m_vHeading, toTarget));
        if (radius < 0.000001) 
            return true; // 说明当前朝向正确，不需要转弯

        if (radius > this.m_dMaxTurnRate) 
            radius = this.m_dMaxTurnRate;
        
        /// 默认矩阵
        let defaultMatrix: Laya.Matrix3x3 = Laya.Pool.getItem("Matrix3x3") || new Laya.Matrix3x3();
        /// 输出矩阵
        let tempRoMatrix = defaultMatrix.clone();

        let r = Utils.VectorSign(toTarget, this.m_vHeading) * radius;

        /// 得到旋转矩阵
        defaultMatrix.rotate(r, tempRoMatrix);
        
        /// 更新速度方向 以及朝向
        this.m_vVelocity = Utils.GetVecByRotationMatrix(tempRoMatrix, this.m_vVelocity);
        this.m_vHeading = Utils.GetVecByRotationMatrix(tempRoMatrix, this.m_vHeading);

        Laya.Pool.recover("Matrix3x3", defaultMatrix);

        this.m_vSide = Utils.GetVectorPerp(this.m_vHeading); 

        return false;

    }
    
}