import PathNode from "./PathNode";
import Vector2 from "./Vector2";

class PathFinding
{
    #grid
    #gridIndex;
    #openList;
    #openListHistory;
    #closedList;
    #allDirection;
    #endPosition


    /**
     * 
     * @param {Object} grid 
     * @param {number} gridIndex
     */
    constructor(grid, gridIndex, allDirections)
    {
        this.#grid = grid;
        this.#gridIndex = gridIndex;
        this.#allDirection = allDirections
        // this.#openList = []; 
        // this.#openListHistory = []; 
        // this.#closedList = []; 
    }

    /**
     * 
     * @param {Vector2} startPosition 
     * @param {Vector2} endPosition 
     * @returns {PathNode[]} 
     */
    findPath(startPosition, endPosition)
    {
        this.#endPosition = endPosition
        const startNode = new PathNode(startPosition, this.#gridIndex);
        const endNode = new PathNode(endPosition, this.index);

        this.#openList = [ startNode ]; 
        this.#closedList = []; 

        startNode.gCost = 0;
        startNode.hCost = this.calculateHCost(startPosition, endPosition);
        startNode.calculateFCost();


        while (this.#openList.length > 0)
        {
            const currentNode = this.getLowestFCostNode(this.#openList)
            if (currentNode.x === endNode.x && currentNode.y === endNode.y)
            {
                console.log("we passed here");
                return this.getActualPath(currentNode)
            }

            this.#openList = this.removeFrom(this.#openList, currentNode)
            this.#closedList.push(currentNode)

            for (const direction of this.getNeighbourList(currentNode))
            {
                this.#openList.push(direction)
            }
        }
    }

    /**
     * 
     * @param {PathNode} currentPathNode 
     * @returns {PathNode[]}
     */
    getNeighbourList(currentPathNode)
    {
        const neighbourList = [];
        for (const direction of this.#allDirection)
        {
            const nextPositionIndex = currentPathNode.index + direction
            if (this.#closedList.some(pathNode => pathNode.index === nextPositionIndex))
            {
                continue
            }
            if (this.#openList.some(pathNode => pathNode.index === nextPositionIndex))
            {
                continue
            }
            const isNextGhostPositionAWall = this.#grid[nextPositionIndex].value === 1
            const isNextGhostPositionAGhost = this.#grid[nextPositionIndex].value === 6
            if (isNextGhostPositionAWall || isNextGhostPositionAGhost)
            {
                continue
            }
            const nextPossibleMovePosition = this.#grid[nextPositionIndex]
            const nextPossibleMoveVector = new Vector2(nextPossibleMovePosition.posX, nextPossibleMovePosition.posY)
            const distance = nextPossibleMoveVector.Distance(this.#endPosition)
            const nextHCost = Math.floor(distance*10)
            const nextGCost = 10 + currentPathNode.gCost
            const nextPathNode = new PathNode(nextPossibleMoveVector, nextPositionIndex)
            nextPathNode.hCost = nextHCost
            nextPathNode.gCost = nextGCost
            nextPathNode.calculateFCost()
            nextPathNode.cameFromNode = currentPathNode
            nextPathNode.direction = direction
            neighbourList.push(nextPathNode)
        }

        return neighbourList
    }

    /**
     * 
     * @param {PathNode} endNode 
     * @returns {PathNode[]}
     */
    getActualPath(endNode)
    {
        console.log(endNode);
        const path = [endNode]
        let currentNode = endNode
        while (currentNode.cameFromNode !== null)
        {
            path.push(currentNode.cameFromNode)
            currentNode = currentNode.cameFromNode
        }
        path.reverse()
        return path
    }
    
    /**
     * 
     * @param {PathNode[]} pathNodeList 
     * @returns {PathNode}
     */
    getLowestFCostNode(pathNodeList)
    {
        let lowestFCostNode = pathNodeList[0]
        for (let i = 1; i < pathNodeList.length; i++)
        {
            if (pathNodeList[i].fCost < lowestFCostNode.fCost)
            {
                lowestFCostNode = pathNodeList[i]
            }
        }
        return lowestFCostNode;
    }

    /**
     * Calculate hCost 
     * @param {Vector2} posA 
     * @param {Vector2} posB 
     * @returns {number} hCost
     */
    calculateHCost(posA, posB)
    {
        const distance = posA.Distance(posB)
        return Math.floor(distance*10)
    }

    /**
     * 
     * @param {Array} arr 
     * @param {*} value 
     */
    removeFrom(arr, value) 
    { 
         return arr.filter(ele => { 
             return ele !== value; 
         });
    }

}

export default PathFinding