import BaseGameEntity from "../Entity/BaseGameEntity";

export default class SteeringBehaviors {

    constructor (Entity: BaseGameEntity) {

    }

    /**
     * 计算当前实体受到的力的合
     */
    Calculate(): Laya.Vector2 {
        return new Laya.Vector2(0, -5);
    }

}