import React from 'react'
import Ghost from './Ghost'

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
            pacManSpawnPoint: 490,
            pacManCurrentPosition: 490,
            score: 0,
            ghosts: [
                new Ghost('blinky', 348, 250), //348
                new Ghost('pinky', 376, 400),
                new Ghost('inky', 351, 300),
                new Ghost('clyde', 379, 500),
                // new Ghost('inky', 34, 300),
                // new Ghost('inky', 30, 300),
            ]
        }
    } //

    componentDidMount = async () =>
    {
        await this.createBoard()
        this.spawnPacMan()
        this.spawnGhosts()
        // this.moveGhosts()
        this.printAStar()
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
        const _layout = []
        let i = 0
        for (let y = 0; y < this.state.width; y++)
        {
            for (let x = 0; x < this.state.width; x++)
            {
                finalLayout.push({
                    posX: x,
                    posY: y,
                    value: layout[i]
                })
                _layout.push({
                    posX: x,
                    posY: y,
                    value: layout[i++]
                })
            }
        }
        this.setState({ 
            finalLayout: finalLayout, 
            _layout: _layout, 
            squares: layout 
        })
    }

    spawnPacMan = () =>
    {
        const finalLayout = this.state.finalLayout.map((el, index) => {
            if (index === this.state.pacManSpawnPoint) {
                el.value = 5
                return el
            }
            return el
        })
        this.setState({ finalLayout, pacManCurrentPosition: this.state.pacManSpawnPoint })
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
        this.state.ghosts.forEach(ghost => {
            finalLayout[ghost.startIndex].value = 6
            finalLayout[ghost.startIndex].ghost = ghost
        })
        this.setState({ finalLayout })
    }

    moveGhosts = () =>
    {
        const directions =  [-1, +1, this.state.width, -this.state.width]
        const finalLayout = [...this.state.finalLayout]
        this.state.ghosts.forEach( (ghost, index) => {
            ghost.timerId = setInterval(()=>{
                let direction
                if (ghost.className === "blinky" ) {
                    direction = ghost.blinkyMovement(directions, this.state.finalLayout)
                }
                else if (ghost.className === "clyde")
                {
                    direction = ghost.getActualPath(directions, this.state.finalLayout, this.state.pacManCurrentPosition)
                }
                else
                {
                    direction = ghost.blinkyMovement(directions, this.state.finalLayout)
                }
                const prevPositionIndex = ghost.currentIndex
                const nextPositionIndex = ghost.currentIndex + direction
                const thisGhost = finalLayout[prevPositionIndex].ghost
                finalLayout[prevPositionIndex] = {...this.state._layout[prevPositionIndex]}
                if (finalLayout[nextPositionIndex] === undefined) console.log(this.state._layout[prevPositionIndex]);
                finalLayout[nextPositionIndex].value = 6
                finalLayout[nextPositionIndex].ghost = thisGhost
                ghost.currentIndex = nextPositionIndex
                this.setState({ finalLayout })
            }, ghost.speed)
        })
    }
    

    printAStar = async () =>
    {
        console.log("tsaat");
        const directions =  [-1, -this.state.width, +1, this.state.width]
        
        console.log(this.state.ghosts[3].getActualPath(directions, this.state.finalLayout, this.state.pacManCurrentPosition));

        setTimeout(async ()=>
        {
            const caca = this.state.ghosts[3].clydeMouvementGreedy(directions, this.state.finalLayout, this.state.pacManCurrentPosition)

            function flatten(arr) {
                return arr.reduce(function (flat, toFlatten) {
                  return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                }, []);
              }
            console.log("nombre de calculs",flatten(caca.openListHistory).length);
            console.log("déplacements",caca.actualPath.length);
            const layout = [...this.state.finalLayout]
            for (let i = 0; i < caca.closedList.length; i++)
            {
                // console.log('closed list', i, caca.closedList[i]);
                // const layout = [...this.state.finalLayout]
                layout[caca.closedList[i].index].value = 7
                layout[caca.closedList[i].index].gCost = caca.closedList[i].gCost
                layout[caca.closedList[i].index].hCost = caca.closedList[i].hCost
                layout[caca.closedList[i].index].fCost = caca.closedList[i].fCost
                this.setState({ finalLayout: layout })
                await this.sleep(0.05)
                // console.log('open list', i, caca.openList);
                if (caca.openListHistory[i]) 
                {
                    for (let j = 0; j< caca.openListHistory[i].length; j++)
                    {
                        // console.log(caca.openListHistory[i][j].index);
                        layout[caca.openListHistory[i][j].index].value = 8
                        layout[caca.openListHistory[i][j].index].gCost = caca.openListHistory[i][j].gCost
                        layout[caca.openListHistory[i][j].index].hCost = caca.openListHistory[i][j].hCost
                        layout[caca.openListHistory[i][j].index].fCost = caca.openListHistory[i][j].fCost
                        this.setState({ finalLayout: layout })
                        await this.sleep(0.05)
                    }
                }
                
                layout[caca.closedList[i].index].value = 9
                this.setState({ finalLayout: layout })
                await this.sleep(0.05)
            }
            // const layout = [...this.state.finalLayout]
            if (caca.positionFound)
            {
                console.log(caca.actualPath);
                for (let i = 0; i < caca.actualPath.length; i++)
                {
                    layout[caca.actualPath[i].index].value = 10
                    layout[caca.actualPath[i].index].gCost = caca.actualPath[i].gCost
                    layout[caca.actualPath[i].index].hCost = caca.actualPath[i].hCost
                    layout[caca.actualPath[i].index].fCost = caca.actualPath[i].fCost
                    this.setState({ finalLayout: layout })
                    await this.sleep(0.1)
                }
                this.setState({ finalLayout: layout })
                await this.sleep(0.5)
            }
            
        }, 
        0)
    }

    sleep = (seconds) => {
        return new Promise(resolve => setTimeout(resolve, seconds*1000));
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
                            {el.value === 0 && (<div key={index} className="empty"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 1 && (<div key={index} className="wall"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 2 && (<div key={index} className="ghost-lair"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 3 && (<div key={index} className="power-pellet"><p>[{el.posX}-{el.posY}] {el.value} {index}</p> </div>)}
                            {el.value === 4 && (<div key={index} className="empty"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 5 && (<div key={index} className="pac-man"><p>[{el.posX}-{el.posY}] {el.value} {index}</p></div>)}
                            {el.value === 6 ? el.ghost.render():null}
                            {el.value === 7 && (<div key={index} className="green"><p>[{el.gCost}-{el.hCost}] {el.fCost} {index}</p></div>)}
                            {el.value === 8 && (<div key={index} className="blue"><p>[{el.gCost}-{el.hCost}] {el.fCost} {index}</p></div>)}
                            {el.value === 9 && (<div key={index} className="light-red"><p>[{el.gCost}-{el.hCost}] {el.fCost} {index}</p></div>)}
                            {el.value === 10 && (<div key={index} className="orange"><p>[{el.gCost}-{el.hCost}] {el.fCost} {index}</p></div>)}
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