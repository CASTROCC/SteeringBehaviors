import GameWorld from "../GameWorld/GameWorld";
import SteeringBehaviors from "../Behaviors/SteeringBehaviors";
import MovingEntity from "./MovingEntity";
import Utils from "../Utils/Utils";

export default class Vehicle extends MovingEntity{
    
    /** 指向世界，存储世界地图的障碍、路径、墙壁等 */
    private m_GameWold: GameWorld;
    public get GameWold(): GameWorld {
        return this.m_GameWold;
    }
    public set GameWold(v: GameWorld) {
        this.m_GameWold = v;
    }

    /** 转向行为类 */
    private m_StreeBehaviors: SteeringBehaviors;
    public get StreeBehaviors(): SteeringBehaviors {
        return this.m_StreeBehaviors;
    }
    public set StreeBehaviors(v: SteeringBehaviors) {
        this.m_StreeBehaviors = v;
    }

    /** 一些转向行为给颠簸的运动. */
    private m_HeadingSmoother: Array<Laya.Vector2>; 
    public get HeadingSmoother(): Array<Laya.Vector2> {
        return this.m_HeadingSmoother;
    }
    public set HeadingSmoother(v: Array<Laya.Vector2>) {
        this.m_HeadingSmoother = v;
    }

    /** 在最后几帧中平滑的车辆航向向量的平均值 */
    private m_vSmoothedHeading: Laya.Vector2;
    public get SmoothedHeading(): Laya.Vector2 {
        return this.m_vSmoothedHeading;
    }
    public set SmoothedHeading(v: Laya.Vector2) {
        this.m_vSmoothedHeading = v;
    }

    /** 是否开启平滑处理 */
    private m_SmoothingOn: boolean;
    public get SmoothingOn(): boolean {
        return this.m_SmoothingOn;
    }
    public set SmoothingOn(v: boolean) {
        this.m_SmoothingOn = v;
    }
    
    /** 最新的更新时间 */
    private m_deltaElapsed: number;
    public get deltaElapsed(): number {
        return this.m_deltaElapsed;
    }
    public set deltaElapsed(v: number) {
        this.m_deltaElapsed = v;
    }

    /** laya渲染图形 */
    private m_VehicleShape: Laya.Node;
    public get VehicleShape(): Laya.Node {
        return this.m_VehicleShape;
    }
    public set VehicleShape(v: Laya.Node) {
        this.m_VehicleShape = v;
    }

    constructor(
        render: Laya.Node,
        world: GameWorld,
        position: Laya.Vector2,
        rotation: number,
        velocity: Laya.Vector2,
        mass: number,
        max_force: number,
        max_speed: number,
        max_turn_rate: number,
        scale: number,
        radius: number = 0
    ) {
        super(velocity, max_speed, new Laya.Vector2(Math.sin(rotation),-Math.cos(rotation)), mass, max_turn_rate, max_force, position, radius , new Laya.Vector2(scale, scale))
        this.VehicleShape = render;
        this.m_GameWold = world;
        this.m_vSmoothedHeading = new Laya.Vector2(0, 0);
        this.m_deltaElapsed = 0.0;
        this.m_SmoothingOn = false;

        this.m_StreeBehaviors = new SteeringBehaviors(this);
        this.m_HeadingSmoother = [];
        this.m_HeadingSmoother.push(new Laya.Vector2(0, 0));
    }


    public Update(dt: number): void {
        this.m_deltaElapsed = dt;
        let oldPos = this.Pos;
        /// 计算当前移动实体所受到的所有合力
        let streeingForce = this.m_StreeBehaviors.Calculate();
        /// 加速度 = 力 / 质量
        let acceleration = new Laya.Vector2(streeingForce.x / this.Mass, streeingForce.y / this.Mass);
        /// 更新速度 速度 = 当前速度 + (加速度 * 时间)
        this.Velocity = new Laya.Vector2((acceleration.x * dt) + this.Velocity.x, (acceleration.y * dt) + this.Velocity.y);
        /// 更新位置 距离 = 时间 * 速度
        this.Pos = new Laya.Vector2((this.Velocity.x * dt) + this.Pos.x, (this.Velocity.y * dt) + this.Pos.y);

        /// 当且仅当当前速度不为0的时候，才更新方向向量，避免除0错误
        if (Laya.Vector2.scalarLength(this.Velocity) > 0.0000001) {
            let t = new Laya.Vector2();
            Laya.Vector2.normalize(this.Velocity, t);
            this.vHeading = t;
            this.vSide = Utils.GetVectorPerp(this.vHeading);
        }
    }
}