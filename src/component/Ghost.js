import React from "react";
import PathFinding from "../utils/PathFinding";
import PathNode from "../utils/PathNode";
import Vector2 from "../utils/Vector2";

class Ghost 
{
    constructor(className, startIndex, speed)
    {
        this.className = className
        this.startIndex = startIndex
        this.speed = speed
        this.currentIndex = startIndex
        this.timerId = NaN
        this.isOut = false
        this.directions = null
    }

    /**
     * Les mouvements de Blinky (rouge) sont rapides et aléatoires.
     * Dés qu'il à le choix de se déplacer sur au moins 3 routes différentes, il choisira une au hasard.
     * Sinon il ira tout droit jusqu'à ce qu'il heurte un obstacle (mur ou fantome), où il choisira une direction possible aléatoirement
     * @param {*} allDirections 
     * @param {*} finalLayout 
     * @returns {number}
     */
    blinkyMovement = (allDirections, finalLayout) =>
    {
        let nextPositionIndex
        let possibleDirections = []
        for (let i = 0; i < allDirections.length; i++)
        {
            nextPositionIndex = this.currentIndex + allDirections[i]
            const isNextGhostPositionAWall = finalLayout[nextPositionIndex].value === 1
            const isNextGhostPositionOut = finalLayout[nextPositionIndex].value === 4
            const isNextGhostPositionIn = finalLayout[nextPositionIndex].value === 2
            const isNextGhostPositionAGhost = finalLayout[nextPositionIndex].value === 6
            if (!this.isOut && isNextGhostPositionOut) 
            {
                this.isOut = true
                possibleDirections = [allDirections[i]]
                break
            }
            else if (!this.isOut && !isNextGhostPositionAWall && !isNextGhostPositionAGhost )
            {
                possibleDirections.push(allDirections[i])
            }
            else if (this.isOut && !isNextGhostPositionIn && !isNextGhostPositionAWall && !isNextGhostPositionAGhost )
            {
                possibleDirections.push(allDirections[i])
            }
        }
        if (possibleDirections.length >= 3)
        {
            const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
            this.direction = direction
            return this.direction
        }
        else 
        {
            const direction = this.direction || possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
            nextPositionIndex = this.currentIndex + direction
            if (finalLayout[nextPositionIndex] === undefined) return 0
            const isNextGhostPositionAWall = finalLayout[nextPositionIndex].value === 1
            const isNextGhostPositionAGhost = finalLayout[nextPositionIndex].value === 6
            if (this.currentIndex === 364 && nextPositionIndex === 363)
            {
                return 27
            }
            else if (this.currentIndex === 391 && nextPositionIndex === 392)
            {
                return -27
            }
            else if (isNextGhostPositionAWall || isNextGhostPositionAGhost )
            {
                this.direction = null
                return this.blinkyMovement(allDirections, finalLayout)
            }
            this.direction = direction
            return this.direction
        }
    }

    clydeMouvement = (allDirections, finalLayout, indexDestination, openList = [], closedList = [], gCost = 0, openListHistory = []  ) =>
    {
        
        const currentPosition = finalLayout[this.currentIndex]
        const destinationPosition = finalLayout[indexDestination]
        const currentVector = new Vector2(currentPosition.posX, currentPosition.posY)
        const destinationVector = new Vector2(destinationPosition.posX, destinationPosition.posY)
        const distance = currentVector.Distance(destinationVector)
        const hCost = Math.floor(distance*10) // la distance en gros
        const fCost = gCost + hCost // cout total = cout de déplacement + distance
        let newOpenList = []
        let newOpenListHistory = []
        if (openList.length === 0 && closedList.length === 0)
        {
            closedList.push({
                position: currentPosition,
                index: this.currentIndex,
                gCost: gCost, 
                hCost, 
                fCost
            })
            const firstResearch = []
            allDir : for (let i = 0; i < allDirections.length; i++)
            {
                const nextPositionIndex = this.currentIndex + allDirections[i]
                const nextPossibleMovePosition = finalLayout[nextPositionIndex]


                const isNextGhostPositionAWall = nextPossibleMovePosition.value === 1
                const isNextGhostPositionAGhost = nextPossibleMovePosition.value === 6


                if (isNextGhostPositionAWall || isNextGhostPositionAGhost)
                {
                    continue allDir
                }

                const nextPossibleMoveVector = new Vector2(nextPossibleMovePosition.posX, nextPossibleMovePosition.posY)
                const distance = nextPossibleMoveVector.Distance(destinationVector)
                const nextHCost = Math.floor(distance*10)
                const nextGCost = 10 + gCost
                const nextFCost = nextGCost + nextHCost
                // console.log(`NextPos ${nextPositionIndex} : ${fCost} => ${nextHCost}distance + ${nextGCost}effort`);
                firstResearch.push({
                    position: nextPossibleMovePosition,
                    index: nextPositionIndex,
                    gCost: nextGCost, 
                    hCost: nextHCost, 
                    fCost: nextFCost
                })
            }
            newOpenList = [...firstResearch]
            newOpenListHistory.push(firstResearch)
        }
        else if (openList.length === 0)
        {
            console.log('no solution found')
            return {
                openList,
                openListHistory: openListHistory,
                closedList,
            }
        }
        else
        {
            newOpenListHistory = [...openListHistory]
            newOpenList = []
            allIndex : for (let j = 0; j < openList.length; j++)
            {
                if (closedList.some(closedResearch => closedResearch.index === openList[j].index))
                {
                    continue allIndex
                }
                closedList.push({
                    position: openList[j].position,
                    index: openList[j].index,
                    gCost: openList[j].gCost, 
                    hCost: openList[j].hCost, 
                    fCost: openList[j].fCost
                })
                
                const nextResearch = []
                allDir : for (let k = 0; k < allDirections.length; k++)
                {
                    const nextPositionIndex = openList[j].index + allDirections[k]
                    if (closedList.some(closedResearch => closedResearch.index === nextPositionIndex))
                    {
                        continue allDir
                    }
                    if (closedList.every(closedResearch => closedResearch.index === nextPositionIndex))
                    {
                        return 0
                    }
                    const isNextGhostPositionAWall = finalLayout[nextPositionIndex].value === 1
                    const isNextGhostPositionAGhost = finalLayout[nextPositionIndex].value === 6
                    if (isNextGhostPositionAWall || isNextGhostPositionAGhost)
                    {
                        continue allDir
                    }
                    const nextPossibleMovePosition = finalLayout[nextPositionIndex]
                    const nextPossibleMoveVector = new Vector2(nextPossibleMovePosition.posX, nextPossibleMovePosition.posY)
                    const distance = nextPossibleMoveVector.Distance(destinationVector)
                    const nextHCost = Math.floor(distance*10)
                    const nextGCost = 10 + gCost
                    const nextFCost = nextGCost + nextHCost
                    nextResearch.push({
                        position: nextPossibleMovePosition,
                        index: nextPositionIndex,
                        gCost: nextGCost, 
                        hCost: nextHCost, 
                        fCost: nextFCost
                    })
                    newOpenList.push({
                        position: nextPossibleMovePosition,
                        index: nextPositionIndex,
                        gCost: nextGCost, 
                        hCost: nextHCost, 
                        fCost: nextFCost
                    })
                    
                    if (nextPositionIndex === indexDestination)
                    {
                        console.error('found', finalLayout[openList[j].index], finalLayout[nextPositionIndex]);
                        const test = [...closedList]
                        console.log(test);
                        return {
                            openList,
                            openListHistory: newOpenListHistory,
                            closedList,
                            positionFound: {
                                position: nextPossibleMovePosition,
                                index: nextPositionIndex,
                                gCost: nextGCost, 
                                hCost: nextHCost, 
                                fCost: nextFCost
                            },
                            prevPositionFound: finalLayout[openList[j].index]
                        }
                    }
                    
                }
                if (newOpenList.length > 8)
                {
                    newOpenList.sort((a, b) => a.fCost - b.fCost)
                    newOpenList.splice(8)
                    // console.log(newOpenList);
                }
                newOpenListHistory.push(nextResearch)
            }
            
        } // end of else
        
        return this.clydeMouvement(allDirections, finalLayout, indexDestination, newOpenList, closedList, (gCost+10), newOpenListHistory )
    }

    clydeMouvementGreedy = (allDirections, finalLayout, indexDestination, openList = [], closedList = [], gCost = 0, openListHistory = [] ) =>
    {
        console.time("init")
        const currentPosition = finalLayout[this.currentIndex]
        const destinationPosition = finalLayout[indexDestination]
        const currentVector = new Vector2(currentPosition.posX, currentPosition.posY)
        const destinationVector = new Vector2(destinationPosition.posX, destinationPosition.posY)

        const distance = currentVector.Distance(destinationVector)
        const hCost = Math.floor(distance*10) // la distance en gros
        const fCost = gCost + hCost // cout total = cout de déplacement + distance
        let newOpenListHistory = [...openListHistory]
        const nextResearch = []

        if (openList.length === 0)
        {
            const startNode = new PathNode(currentPosition, this.currentIndex)
            startNode.gCost = gCost
            startNode.hCost = hCost
            startNode.calculateFCost()
            openList.push(startNode)
        }

        for (let i = 0; i < allDirections.length; i++)
        {
            const nextPositionIndex = openList[0].index + allDirections[i]
            if (closedList.some(closedResearch => closedResearch.index === nextPositionIndex))
            {
                continue
            }
            if (openList.some(openResearch => openResearch.index === nextPositionIndex))
            {
                continue
            }
            const isNextGhostPositionAWall = finalLayout[nextPositionIndex].value === 1
            const isNextGhostPositionAGhost = finalLayout[nextPositionIndex].value === 6
            if (isNextGhostPositionAWall || isNextGhostPositionAGhost)
            {
                continue
            }
            const nextPossibleMovePosition = finalLayout[nextPositionIndex]
            const nextPossibleMoveVector = new Vector2(nextPossibleMovePosition.posX, nextPossibleMovePosition.posY)
            const distance = nextPossibleMoveVector.Distance(destinationVector)
            const nextHCost = Math.floor(distance*10)
            const nextGCost = 10 + openList[0].gCost
            const nextFCost = nextGCost + nextHCost


            const nextPathNode = new PathNode(nextPossibleMovePosition, nextPositionIndex)
            nextPathNode.hCost = nextHCost
            nextPathNode.gCost = nextGCost
            nextPathNode.calculateFCost()
            nextPathNode.cameFromNode = openList[0]

            
            
            if (nextPositionIndex === indexDestination)
            {
                console.error('found', finalLayout[openList[0].index], finalLayout[nextPositionIndex]);
                closedList.push(openList[0])
                closedList.push(nextPathNode)
                console.timeEnd("init")
                const tab = [nextPathNode]
                let currentPathNode = nextPathNode
                while (currentPathNode.cameFromNode !== null)
                {
                    tab.push(currentPathNode.cameFromNode)
                    currentPathNode = currentPathNode.cameFromNode
                }
                return {
                    openList,
                    closedList,
                    openListHistory: newOpenListHistory,
                    positionFound: nextPathNode,
                    actualPath: tab
                }
            }

            openList.push(nextPathNode)
            nextResearch.push(nextPathNode)
            
        }
        closedList.push(openList[0])
        openList.splice(0, 1)
        if (openList.length < 100)
        {
            openList.sort((a, b) =>{
                if (a.fCost > b.fCost) return 1
                else if (a.fCost === b.fCost) return a.hCost - b.hCost //return a.hCost - b.hCost //return b.gCost - a.gCost
                else return -1
            })
        }
        else 
        {
            openList.sort((a, b) =>{
                if (a.hCost > b.hCost) return 1
                else if (a.hCost === b.fCost) return a.fCost - b.fCost //return a.hCost - b.hCost //return b.gCost - a.gCost
                else return -1
            })
        }
        
        newOpenListHistory.push(nextResearch)

        return this.clydeMouvementGreedy(allDirections, finalLayout, indexDestination, openList, closedList, (gCost+10), newOpenListHistory )
    }

    getActualPath(allDirections, finalLayout, indexDestination)
    {
        if (this.directions === null || this.directions.length < 5)
        {
            const currentPosition = finalLayout[this.currentIndex]
            const currentVector = new Vector2(currentPosition.posX, currentPosition.posY)
            
            const destinationPosition = finalLayout[indexDestination]
            const destinationVector = new Vector2(destinationPosition.posX, destinationPosition.posY)
            
            const pathFinding = new PathFinding(finalLayout, this.currentIndex, allDirections)

            const pathNodes = pathFinding.findPath(currentVector, destinationVector)
            this.directions = pathNodes;
            this.directions.splice(0, 1)
        }
        
        const direction = this.directions[0].direction
        this.directions.splice(0, 1)
        return direction
        
    }

    defaultMouvement = (allDirections, finalLayout) =>
    {
        let nextPositionIndex
        let possibleDirections = []
        for (let i = 0; i < allDirections.length; i++)
        {
            nextPositionIndex = this.currentIndex + allDirections[i]
            const isNextGhostPositionAWall = finalLayout[nextPositionIndex].value === 1
            const isNextGhostPositionAGhost = finalLayout[nextPositionIndex].value === 6
            if (!isNextGhostPositionAWall && !isNextGhostPositionAGhost )
            {
                possibleDirections.push(allDirections[i])
            }
        }
        if (possibleDirections.length === 0) return 0
        const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
        // return 0
        return direction
    }

    render = () =>
    {
        return <GhostComponent isOut={this.isOut} currentIndex={this.currentIndex} className={this.className} />
    }
}

export class GhostComponent extends React.Component
{
    constructor()
    {
        super()
        this.state = {}
    }
    componentDidMount = () =>
    {
        // console.log(this);
    }
    render = () =>
    {
        if (this.props)
        {
            return <div className={this.props.className}>{JSON.stringify(this.props.isOut)}</div>
        }
        return <></>
    }
}

export default Ghost