import React from "react";
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
    }

    /**
     * Les mouvements de Blinky sont rapides et aléatoires.
     * Dés qu'il à le choix de se déplacer sur au moins 3 routes différentes, il choisira une au hasard.
     * Sinon il ira tout droit jusqu'à ce qu'il heurte un obstacle (mur ou fantome), où il choisira une direction possible aléatoirement
     * @param {*} allDirections 
     * @param {*} finalLayout 
     * @returns 
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

    tab = [0]
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
            newOpenList.push(firstResearch)
            newOpenListHistory.push(firstResearch)
        }
        else
        {
            newOpenListHistory = [...openListHistory]
            newOpenList = []
            for (let i = 0; i < openList.length; i++)
            {
                allIndex : for (let j = 0; j < openList[i].length; j++)
                {
                    if (closedList.some(closedResearch => closedResearch.index === openList[i][j].index))
                    {
                        continue allIndex
                    }
                    closedList.push({
                        position: openList[i][j].position,
                        index: openList[i][j].index,
                        gCost: openList[i][j].gCost, 
                        hCost: openList[i][j].hCost, 
                        fCost: openList[i][j].fCost
                    })
                    
                    const nextResearch = []
                    allDir : for (let k = 0; k < allDirections.length; k++)
                    {
                        const nextPositionIndex = openList[i][j].index + allDirections[k]
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
                        
                        if (nextPositionIndex === indexDestination)
                        {
                            console.error('found', finalLayout[openList[i][j].index], finalLayout[nextPositionIndex]);
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
                                prevPositionFound: finalLayout[openList[i][j].index]
                            }
                        }
                        
                    }
                    newOpenList.push(nextResearch)
                    // newOpenList.sort((a, b) => a.)
                    newOpenListHistory.push(nextResearch)
                    // const count = newOpenList.reduce((count, row) => count + row.length, 0);
                    // console.log(count);
                }
                
            }
        } // end of else
        
        return this.clydeMouvement(allDirections, finalLayout, indexDestination, newOpenList, closedList, (gCost+10), newOpenListHistory )
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
        return 0
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