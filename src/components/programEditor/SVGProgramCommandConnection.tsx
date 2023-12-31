import { IProgramCommand } from "@/modules/roboships/programcomponents";
import { IShip } from "@/modules/roboships/ship";
import { calculateCenterArrowPoints } from "@/modules/roboships/shapeutils";

const emptyConnetcionDistance: number = 10

interface ISVGProgramCommandProps {
    ship: IShip
    scale: number
    command: IProgramCommand
    scrollPos: { x: number, y: number }

    connectionSelected: (connection: ISelectedConnection) => void
    selectedConnection: ISelectedConnection | null
}

export interface ISelectedConnection {
    commandID: number
    connectionIdx: number
    position: { x: number, y: number }
    highlighted: boolean
}

export default function SVGProgramCommand({ ship, scale, command, scrollPos, connectionSelected, selectedConnection }: ISVGProgramCommandProps) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    let items: JSX.Element[] = []

    let numconnetions = command.connectedTo.length

    command.connectedTo.map((connection, index) => {

        let connectionTargetX = command.position.x
        let connectionTargetY = command.position.y + emptyConnetcionDistance

        if (numconnetions > 1) {
            connectionTargetX = command.position.x - (numconnetions - 1) / 2 * emptyConnetcionDistance + index * emptyConnetcionDistance
            connectionTargetY = command.position.y + emptyConnetcionDistance
        }

        let highlighted = false

        if (selectedConnection !== null && selectedConnection.commandID === command.id && selectedConnection.connectionIdx === index) {
            connectionTargetX = selectedConnection.position.x
            connectionTargetY = selectedConnection.position.y
            highlighted = selectedConnection.highlighted
        }
        else if (connection !== -1) {
            const connectedCommand = ship.program.find((command) => command.id === connection)
            if (connectedCommand !== undefined) {
                connectionTargetX = connectedCommand.position.x
                connectionTargetY = connectedCommand.position.y
            }
        }

        items.push(
            <line key={`connectionline${command.id}-${index}`}
                x1={scaledToSVG(-scrollPos.x + command.position.x)}
                y1={scaledToSVG(-scrollPos.y + command.position.y)}
                x2={scaledToSVG(-scrollPos.x + connectionTargetX)}
                y2={scaledToSVG(-scrollPos.y + connectionTargetY)}
                stroke={highlighted ? "lightgray" : numconnetions === 1 ? "black" : index === 0 ? "green" : "red"}
                strokeWidth={scaledToSVG(0.75)}
            />)

        // Arrow

        if (connection !== -1) {

            const arrowPoints= calculateCenterArrowPoints({x: command.position.x, y: command.position.y}, {x: connectionTargetX, y: connectionTargetY})
         
            items.push(
                <line key={`connectionArrowA${command.id}-${index}`}
                    x1={scaledToSVG(-scrollPos.x + arrowPoints[0].x)}
                    y1={scaledToSVG(-scrollPos.y + arrowPoints[0].y)}
                    x2={scaledToSVG(-scrollPos.x + arrowPoints[1].x)}
                    y2={scaledToSVG(-scrollPos.y + arrowPoints[1].y)}
                    stroke={highlighted ? "lightgray" : numconnetions === 1 ? "black" : index === 0 ? "green" : "red"}
                    strokeWidth={scaledToSVG(0.75)}
                />)

            items.push(
                <line key={`connectionArrowB${command.id}-${index}`}
                    x1={scaledToSVG(-scrollPos.x + arrowPoints[0].x)}
                    y1={scaledToSVG(-scrollPos.y + arrowPoints[0].y)}
                    x2={scaledToSVG(-scrollPos.x + arrowPoints[2].x)}
                    y2={scaledToSVG(-scrollPos.y + arrowPoints[2].y)}
                    stroke={highlighted ? "lightgray" : numconnetions === 1 ? "black" : index === 0 ? "green" : "red"}
                    strokeWidth={scaledToSVG(0.75)}
                />)
        }

        if (connection === -1) items.push(

            <circle key={`connectioncircle${command.id}-${index}`}
                cx={scaledToSVG(-scrollPos.x + connectionTargetX)}
                cy={scaledToSVG(-scrollPos.y + connectionTargetY)}
                r={scaledToSVG(2)}
                fill={highlighted ? "green" : "white"}
                stroke={highlighted ? "green" : "black"}
                onMouseDown={(e) => { if(e.button===0)  connectionSelected({ commandID: command.id, connectionIdx: index, position: { x: connectionTargetX, y: connectionTargetY }, highlighted: false }) }}
            />
        )
    })

    return (
        <>{items}</>
    );
}