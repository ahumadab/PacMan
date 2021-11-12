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

    move = (width) =>
    {
        
    }

    render = () =>
    {
        return <GhostComponent currentIndex={this.currentIndex-300} className={this.className} />
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