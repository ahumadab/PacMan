import React from 'react'

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
            pacManCurrentPosition: 490
        }
    }

    componentDidMount = async () =>
    {
        await this.createBoard()
        this.spawnPacMan()
        document.addEventListener('keyup', this.movePacMan)
    }

    componentDidUpdate = (prevProps, prevState) =>
    {
        if (prevState.pacManCurrentPosition !== this.state.pacManCurrentPosition)
        {
            const layout = this.state.layout.map((el, index) => 
            {
                if (index === this.state.pacManCurrentPosition) return 5
                
                if (index === prevState.pacManCurrentPosition) return 2
                return el
            })
            this.setState({ layout })
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
        this.setState({ layout })
    }

    spawnPacMan = () =>
    {
        const layout = this.state.layout.map((el, index) => {
            if (index === this.state.pacManSpointPoint) return 5
            return el
        })
        this.setState({ layout, pacManCurrentPosition: this.state.pacManSpointPoint })
    }

    movePacMan = (e) => 
    {
        const { width, pacManCurrentPosition } = this.state
        switch(e.keyCode)
        {
            case 37:
                if (pacManCurrentPosition % width !== 0)
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition - 1 })
                }
                break
            case 38:
                if (pacManCurrentPosition - width >= 0)
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition - width })
                }
                break
            case 39:
                if (pacManCurrentPosition % width < width-1)
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition + 1 })
                }
                break
            case 40:
                if (pacManCurrentPosition + width < width * width)
                {
                    this.setState({ pacManCurrentPosition: pacManCurrentPosition + width })
                }
                break
        }
    }

    render = () =>
    {
        return (
            <>
                <div className="grid">
                    { this.state.layout.map((el, index) => (
                        <div key={index}>
                            {el=== 0 && (<div className="pac-dot"></div>)}
                            {el=== 1 && (<div className="wall"></div>)}
                            {el=== 2 && (<div className=""></div>)}
                            {el=== 3 && (<div className="power-pellet"></div>)}
                            {el=== 4 && (<div className=""></div>)}
                            {el=== 5 && (<div className="pac-man"></div>)}
                        </div>
                    ))}

                </div>

                <div className="score">

                </div>
            </>
        )
    }
}

export default Game