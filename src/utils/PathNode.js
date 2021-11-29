import Vector2 from "./Vector2";

class PathNode
{
    x;
    y;
    index;

    gCost;
    hCost;
    fCost;

    cameFromNode = null;
    direction = null;

    /**
     * 
     * @param {Vector2} position 
     * @param {number} index 
     */
    constructor(position, index)
    {
        this.index = index
        this.x = position.x;
        this.y = position.y;
    }

    /**
     * calculateFCost
     */
    calculateFCost()
    {
        this.fCost = this.gCost + this.hCost;
    }
}

export default PathNode