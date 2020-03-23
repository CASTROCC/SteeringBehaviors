
export enum Entity_Type {
    default_EntityType = -1,
    MoveEntity = 0
}
export interface IMessage {
    MessageType: string;
    MessageData: any;
}

/**
 * 所有游戏中的实体对象都继承自引擎表现对象Laya.Sprite
 */
export default class BaseGameEntity {

    public static NextID: number = 0;

    /* 由构造函数使用，以给每个实体一个惟一的ID **/
    public static NextValidId(): number {
        return  this.NextID ++;
    }   

    /** 通用标志 */
    private m_Tag: boolean;
    public get Tag(): boolean {
        return this.m_Tag;
    }
    public set Tag(v: boolean) {
        this.m_Tag = v;
    }

    /** 实体唯一ID */
    private m_ID: number; 
    public get ID(): number {
        return this.m_ID;
    }
    public set ID(v: number) {
        this.m_ID = v;
    }

    /** 实体类型 */
    private m_Type: Entity_Type;
    public get Type(): Entity_Type {
        return this.m_Type;
    }
    public set Type(v: Entity_Type) {
        this.m_Type = v;
    }

    /** 实体在环境中的位置 */
    protected m_vPos: Laya.Vector2;
    public get Pos(): Laya.Vector2 {
        return this.m_vPos;
    }
    public set Pos(v: Laya.Vector2) {
        this.m_vPos = v;
    }

    /** 实体的缩放比例 */
    protected m_vScale: Laya.Vector2;
    public get Scale(): Laya.Vector2 {
        return this.m_vScale;
    }
    public set Scale(v: Laya.Vector2) {
        this.m_vScale = v;
    }

    /** 实体对象的边界半径的长度 */
    protected m_dBoundingRadius: number;
    public get BoundingRadius(): number {
        return this.m_dBoundingRadius;
    }
    public set BoundingRadius(v: number) {
        this.m_dBoundingRadius = v;
    }

    constructor(
        EntityId: number = BaseGameEntity.NextValidId(),
        EntityType: number = Entity_Type.default_EntityType, 
        EntityBradius: number = 0,
        EntityPos: Laya.Vector2 = new Laya.Vector2(0,0), 
        EntityScale: Laya.Vector2 = new Laya.Vector2(0,0)
    ) {
        this.m_ID = EntityId;
        this.m_dBoundingRadius = EntityBradius;
        this.m_vPos = EntityPos;
        this.m_vScale = EntityScale;
        this.m_Type = EntityType;
        this.m_Tag = false;
    }
   
    public Update(dt: number): void {

    }

    /** 使用引擎进行渲染, 该接口可以省略 */
    // public Render(): void {

    // }

    public HandleMessage(Message: IMessage): boolean {
        return false;
    }

    ////// entities should be able to read/write their data to a stream

}