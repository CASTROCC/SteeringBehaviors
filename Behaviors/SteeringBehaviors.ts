import BaseGameEntity from "../Entity/BaseGameEntity";
import Utils from "../Utils/Utils";
import Vehicle from "../Entity/Vehicle";

export default class SteeringBehaviors {

    /** 当前行为对象 */
    private _entity : BaseGameEntity;
    public get entity() : BaseGameEntity {
        return this._entity;
    }
    public set entity(v : BaseGameEntity) {
        this._entity = v;
    }

    /** 行为合力 */
    private _vSteeringForce : Laya.Vector2;
    public get vSteeringForce() : Laya.Vector2 {
        return this._vSteeringForce;
    }
    public set vSteeringForce(v : Laya.Vector2) {
        this._vSteeringForce = v;
    }

    /** 当前驶向目标 */
    private _targetPos : Laya.Vector2;
    public get targetPos() : Laya.Vector2 {
        return this._targetPos;
    }
    public set targetPos(v : Laya.Vector2) {
        this._targetPos = v;
    }
    

    constructor (Entity: BaseGameEntity) {
        this._entity = Entity;
        this._targetPos = this.entity.Pos;
        this._vSteeringForce = (this.entity as Vehicle).Velocity || new Laya.Vector2(0, 0);
    }

    /** 计算当前实体受到的力的合 */
    public Calculate(): Laya.Vector2 {
        let a = Utils.Addvector2(this._vSteeringForce, this.seek(this._targetPos));
        // if (a.x === 0 && a.y === 0) {
        //     this._vSteeringForce = Utils.Addvector2(a, this.seek(this._targetPos));
        // }else {
        //     this._vSteeringForce = a;
        // }
        return Utils.Addvector2(this._vSteeringForce, a);
    }

    /*------------------------- 行为(开始) ----------------------------------------- */

    /**
     * 靠近行为 (靠近目标所需要的加速度(力))
     * @param targetPos 
     */
    public seek(targetPos: Laya.Vector2): Laya.Vector2 {
        let desiredVect: Laya.Vector2 = new Laya.Vector2(); /// 预期速度
        Laya.Vector2.normalize(Utils.Subvector2(this._entity.Pos, targetPos), desiredVect)
        Laya.Vector2.scale(desiredVect, (this._entity as Vehicle).MaxSpeed, desiredVect);
        return Utils.Subvector2((this._entity as Vehicle).Velocity, desiredVect); /// 预期速度 - 当前速度
    }

    /**
     * 逃离行为
     * @param targetPos 
     */
    public flee(targetPos: Laya.Vector2): Laya.Vector2 {
        //// 当距离超过vehicle的巡逻半径时 
        let veclen = Laya.Vector2.scalarLength(Utils.Subvector2(targetPos, this._entity.Pos));
        if (veclen > this._entity.BoundingRadius) {
            return new Laya.Vector2(0,0);
        }
        let dersiredVec: Laya.Vector2 = new Laya.Vector2();
        Laya.Vector2.normalize(Utils.Subvector2(targetPos, this._entity.Pos), dersiredVec);
        Laya.Vector2.scale(dersiredVec, (this._entity as Vehicle).MaxSpeed, dersiredVec);
        return Utils.Subvector2((this._entity as Vehicle).Velocity, dersiredVec);
    }

    /*------------------------- 行为(结束) ----------------------------------------- */
}