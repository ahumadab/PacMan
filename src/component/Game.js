import React from 'react'
import Ghost, { GhostComponent } from './Ghost'

class Game extends React.Component
{
    constructor()
    {
        super()
        this.state = {
            width: 28,
            layout: [],
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
        this.spawnGhosts()
        this.moveGhosts()
        this.spawnPacMan()
        
        document.addEventListener('keyup', this.movePacMan)
    }

    componentDidUpdate = (prevProps, prevState) =>
    {
        if (prevState.pacManCurrentPosition !== this.state.pacManCurrentPosition)
        {
            const { layout } = this.state
            const squares = this.state.squares.map((el, index) => 
            {
                if (index === this.state.pacManCurrentPosition) return 5
                if (index === prevState.pacManCurrentPosition) {
                    const hasMovedIntoPacDot = (layout[prevState.pacManCurrentPosition]=== 0) && (prevState.squares[this.state.pacManCurrentPosition] === 0)
                    if (hasMovedIntoPacDot) this.setState({ score: this.state.score + 1})
                    
                    return 4
                }
                return el
            })
            this.setState({ squares })
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
        this.setState({ layout, squares: layout })
    }

    spawnPacMan = () =>
    {
        const squares = this.state.squares.map((el, index) => {
            if (index === this.state.pacManSpointPoint) return 5
            return el
        })
        this.setState({ squares, pacManCurrentPosition: this.state.pacManSpointPoint })
    }

    movePacMan = (e) => 
    {
        const { width, pacManCurrentPosition, layout } = this.state
        let nextPosition
        switch(e.keyCode)
        {
            case 37:
                nextPosition = layout[pacManCurrentPosition - 1]
                if (pacManCurrentPosition % width !== 0  && nextPosition !== 1 && nextPosition !== 2  )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition - 1 })
                }
                if (pacManCurrentPosition - 1 === 363) 
                {
                    this.setState({ pacManCurrentPosition: 391 })
                }
                break
            case 38:
                nextPosition = layout[pacManCurrentPosition - width]
                if (pacManCurrentPosition - width >= 0 && nextPosition !== 1 && nextPosition !== 2  )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition - width })
                }
                break
            case 39:
                nextPosition = layout[pacManCurrentPosition + 1]
                if (pacManCurrentPosition % width < width - 1 && nextPosition !== 1 && nextPosition !== 2   )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition + 1 })
                }
                if (pacManCurrentPosition + 1 === 392) 
                {
                    this.setState({ pacManCurrentPosition: 364 })
                }
                break
            case 40:
                nextPosition = layout[pacManCurrentPosition + width]
                if (pacManCurrentPosition + width < width * width && nextPosition !== 1 && nextPosition !== 2  )
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition + width })
                }
                break
        }
    }

    spawnGhosts = () =>
    {
        const squares = [...this.state.squares]
        this.state.ghosts.forEach(ghost => squares[ghost.startIndex] = ghost )
        this.setState({ squares })
    }

    moveGhosts = () =>
    {
        const directions =  [-1, +1, this.state.width, -this.state.width]
        const squares = [...this.state.squares]
        this.state.ghosts.forEach(ghost => {
            ghost.timerId = setInterval(()=>{
                let direction = directions[Math.floor(Math.random() * directions.length)]
                let prevPositionIndex = ghost.currentIndex
                let nextPositionIndex = ghost.currentIndex + direction
                let isNextGhostPositionAWall = squares[nextPositionIndex] === 1
                let isNextGhostPositionAGhost = !!squares[nextPositionIndex].render
                if (!isNextGhostPositionAWall && !isNextGhostPositionAGhost )
                {
                    const thisGhost = squares[prevPositionIndex]
                    squares[prevPositionIndex] = squares[nextPositionIndex]
                    squares[nextPositionIndex] = thisGhost
                    ghost.currentIndex = nextPositionIndex
                    this.setState({ squares })
                }
            }, ghost.speed)
        })
    }

    render = () =>
    {
        return (
            <>
                <div className="grid">
                    { this.state.squares.map((el, index) => (
                        <>  
                            {el === 0 && (<div key={index} className="pac-dot">{el}</div>)}
                            {el === 1 && (<div key={index} className="wall">{el}</div>)}
                            {el === 2 && (<div key={index} className="ghost-lair">{el}</div>)}
                            {el === 3 && (<div key={index} className="power-pellet">{el}</div>)}
                            {el === 4 && (<div key={index} className="empty">{el}</div>)}
                            {el === 5 && (<div key={index} className="pac-man">{el}</div>)}
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