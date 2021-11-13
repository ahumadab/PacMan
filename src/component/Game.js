import React from 'react'
import Ghost, { GhostComponent } from './Ghost'

class Game extends React.Component
{
    constructor()
    {
        super()
        this.state = {
            width: 28,
            finalLayout: [],
            _layout: [],
            squares: [],
            pacManSpointPoint: 490,
            pacManCurrentPosition: 490,
            score: 0,
            ghosts: [
                new Ghost('blinky', 348, 250),
                new Ghost('pinky', 376, 400),
                new Ghost('inky', 351, 300),
                new Ghost('clyde', 379, 500),
            ]
        }
    }

    componentDidMount = async () =>
    {
        await this.createBoard()
        this.spawnPacMan()
        this.spawnGhosts()
        this.moveGhosts()
        
        document.addEventListener('keyup', this.movePacMan)
    }

    componentDidUpdate = (prevProps, prevState) =>
    {
        if (prevState.pacManCurrentPosition !== this.state.pacManCurrentPosition)
        {
            const finalLayout = this.state.finalLayout.map((el, index) => 
            {
                if (index === this.state.pacManCurrentPosition)
                { 
                    const hasMovedIntoPacDot = this.state.finalLayout[this.state.pacManCurrentPosition].value === 0
                    if (hasMovedIntoPacDot) this.setState({ score: this.state.score + 1})
                    el.value = 5
                    return el
                }
                if (index === prevState.pacManCurrentPosition) {
                    el.value = 4
                    return el
                }
                return el
            })
            
            this.setState({ finalLayout })
        }

    }

    createBoard = () =>
    {
        const layout = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
            4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
            1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
            1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
            1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
            1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
            1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
            1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
        ]
        const finalLayout = []
        let i = 0
        for (let x = 0; x<28; x++)
        {
            for (let y = 0; y<28; y++)
            {
                finalLayout.push({
                    posX: x,
                    posY: y,
                    value: layout[i++]
                })
            }
        }
        this.setState({ finalLayout, _layout: finalLayout, squares: layout })
    }

    spawnPacMan = () =>
    {
        const finalLayout = this.state.finalLayout.map((el, index) => {
            if (index === this.state.pacManSpointPoint) {
                el.value = 5
                return el
            }
            return el
        })
        this.setState({ finalLayout, pacManCurrentPosition: this.state.pacManSpointPoint })
    }

    movePacMan = (e) => 
    {
        const { width, pacManCurrentPosition, finalLayout } = this.state
        let nextPosition
        switch(e.keyCode)
        {
            case 37:
                nextPosition = finalLayout[pacManCurrentPosition - 1]
                if (pacManCurrentPosition % width !== 0  && nextPosition.value !== 1 && nextPosition.value !== 2  )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition - 1 })
                }
                if (pacManCurrentPosition - 1 === 363) 
                {
                    this.setState({ pacManCurrentPosition: 391 })
                }
                break
            case 38:
                nextPosition = finalLayout[pacManCurrentPosition - width]
                if (pacManCurrentPosition - width >= 0 && nextPosition.value !== 1 && nextPosition.value !== 2  )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition - width })
                }
                break
            case 39:
                nextPosition = finalLayout[pacManCurrentPosition + 1]
                if (pacManCurrentPosition % width < width - 1 && nextPosition.value !== 1 && nextPosition.value !== 2   )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition + 1 })
                }
                if (pacManCurrentPosition + 1 === 392) 
                {
                    this.setState({ pacManCurrentPosition: 364 })
                }
                break
            case 40:
                nextPosition = finalLayout[pacManCurrentPosition + width]
                if (pacManCurrentPosition + width < width * width && nextPosition.value !== 1 && nextPosition.value !== 2  )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition + width })
                }
                break
        }
    }

    spawnGhosts = () =>
    {
        const finalLayout = [...this.state.finalLayout]
        this.state.ghosts.forEach(ghost => finalLayout[ghost.startIndex] = ghost )
        this.setState({ finalLayout })
    }

    moveGhosts = () =>
    {
        const directions =  [-1, +1, this.state.width, -this.state.width]
        const finalLayout = [...this.state.finalLayout]
        this.state.ghosts.forEach((ghost, index) => {
            ghost.timerId = setInterval(()=>{
                const direction = index !== 0 
                    ? directions[Math.floor(Math.random() * directions.length)] 
                    : ghost.clydeMovement(directions, this.state.finalLayout)
                const prevPositionIndex = ghost.currentIndex
                const nextPositionIndex = ghost.currentIndex + direction
                const isNextGhostPositionAWall = finalLayout[nextPositionIndex].value === 1
                const isNextGhostPositionAGhost = !!finalLayout[nextPositionIndex].render
                if (!isNextGhostPositionAWall && !isNextGhostPositionAGhost )
                {
                    const thisGhost = finalLayout[prevPositionIndex]
                    finalLayout[prevPositionIndex] = this.state._layout[prevPositionIndex]
                    finalLayout[nextPositionIndex] = thisGhost
                    ghost.currentIndex = nextPositionIndex
                    this.setState({ finalLayout })
                }
            }, ghost.speed)
        })
    }

    render = () =>
    {
        return (
                <>
                <div className="score">
                    {this.state.score}
                </div>
                <div className="grid">
                    { this.state.finalLayout.map((el, index) => (
                        <>  
                            {el.value === 0 && (<div key={index} className="pac-dot"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 1 && (<div key={index} className="wall"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 2 && (<div key={index} className="ghost-lair"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 3 && (<div key={index} className="power-pellet"><p>[{el.posX}-{el.posY}] {el.value} {index}</p> </div>)}
                            {el.value === 4 && (<div key={index} className="empty"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 5 && (<div key={index} className="pac-man"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.render? el.render():null}
                        </>
                    ))}
                </div>
                <div className="score">
                    {this.state.score}
                </div>
            </>
        )
    }
}

export default Game