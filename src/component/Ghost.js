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
    }

    clydeMovement = (allDirections, finalLayout) =>
    {
        
        let nextPositionIndex
        let possibleDirections = []
        for (let i = 0; i < allDirections.length; i++)
        {
            nextPositionIndex = this.currentIndex + allDirections[i]
            const isNextGhostPositionAWall = finalLayout[nextPositionIndex]?.value === 1
            const isNextGhostPositionAGhost = !!!finalLayout[nextPositionIndex].render
            if (!isNextGhostPositionAWall || !isNextGhostPositionAGhost)
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
            const isNextGhostPositionAWall = finalLayout[nextPositionIndex].value === 1
            const isNextGhostPositionAGhost = !!!finalLayout[nextPositionIndex].render
            if (isNextGhostPositionAWall || !isNextGhostPositionAGhost )
            {
                this.direction = null
                return this.clydeMovement(allDirections, finalLayout)
            }
            this.direction = direction
            return this.direction
        }
    }

    render = () =>
    {
        return <GhostComponent currentIndex={this.currentIndex} className={this.className} />
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
            return <div className={this.props.className}>{this.props.currentIndex}</div>
        }
        return <></>
    }
}

export default Ghost