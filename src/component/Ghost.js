import React from "react";

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
            if (finalLayout[nextPositionIndex] == undefined) return 0
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

    clydeMouvement = (allDirections, finalLayout) =>
    {
        return 1
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
        if (possibleDirections.length == 0) return 0
        const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
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