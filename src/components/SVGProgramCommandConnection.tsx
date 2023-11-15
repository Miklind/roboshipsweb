import { IProgramCommand } from "@/modules/roboships/programcomponents";
import SVGProgramParameter from "./SVGProgramParameter";
import { IShip } from "@/modules/roboships/ship";
import { comma } from "postcss/lib/list";


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

export const commandWidth: number = 32
export const commandHeight: number = 8
const commmandTitleHeight: number = 3

export default function SVGProgramCommand({ ship, scale, command, scrollPos, connectionSelected, selectedConnection }: ISVGProgramCommandProps) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    let items: JSX.Element[] = []

    let numconnetions = command.connectedTo.length

    command.connectedTo.map((connection, index) => {

      
        let connectionTargetX =  command.position.x
        let connectionTargetY =  command.position.y + emptyConnetcionDistance

        if(numconnetions > 1)
        {
            connectionTargetX = command.position.x - (numconnetions-1) / 2 * emptyConnetcionDistance + index * emptyConnetcionDistance
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
                connectionTargetX =  connectedCommand.position.x
                connectionTargetY =  connectedCommand.position.y
            }
        }

        items.push(
            <line key={`connectionline${command.id}-${index}`}
                x1={scaledToSVG(-scrollPos.x + command.position.x)}
                y1={scaledToSVG(-scrollPos.y + command.position.y)}
                x2={scaledToSVG(-scrollPos.x + connectionTargetX)}
                y2={scaledToSVG(-scrollPos.y + connectionTargetY)}
                stroke={highlighted ? "lightgray" : numconnetions===1 ? "black" : index===0 ? "green" : "red"}
                strokeWidth={scaledToSVG(0.75)}
            />)


        // Arrow

        if(connection !== -1)
        {

        const xdiff=connectionTargetX - command.position.x;
        const ydiff=connectionTargetY - command.position.y;

        const lenght=Math.sqrt(xdiff*xdiff + ydiff*ydiff);
        const xNorm=xdiff/lenght;
        const yNorm=ydiff/lenght;

        const sideWaysX=yNorm;
        const sideWaysY=-xNorm

        const arrowEndCenterX=command.position.x + xNorm * (lenght/2 - 1.5);
        const arrowEndCenterY=command.position.y + yNorm * (lenght/2 - 1.5);

        const arrowStartCenterX=command.position.x + xNorm * (lenght/2 + 1.5);
        const arrowStartCenterY=command.position.y + yNorm * (lenght/2 + 1.5);

        items.push(
            <line key={`connectionArrowA${command.id}-${index}`}
                x1={scaledToSVG(-scrollPos.x + arrowStartCenterX)}
                y1={scaledToSVG(-scrollPos.y + arrowStartCenterY)}
                x2={scaledToSVG(-scrollPos.x + arrowEndCenterX + sideWaysX * 2)}
                y2={scaledToSVG(-scrollPos.y + arrowEndCenterY + sideWaysY * 2)}
                stroke={highlighted ? "lightgray" : numconnetions===1 ? "black" : index===0 ? "green" : "red"}
                strokeWidth={scaledToSVG(0.75)}
            />)

        items.push(
            <line key={`connectionArrowB${command.id}-${index}`}
                x1={scaledToSVG(-scrollPos.x + arrowStartCenterX)}
                y1={scaledToSVG(-scrollPos.y + arrowStartCenterY)}
                x2={scaledToSVG(-scrollPos.x + arrowEndCenterX - sideWaysX * 2)}
                y2={scaledToSVG(-scrollPos.y + arrowEndCenterY - sideWaysY * 2)}
                stroke={highlighted ? "lightgray" : numconnetions===1 ? "black" : index===0 ? "green" : "red"}
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
                onMouseDown={() => { connectionSelected({ commandID: command.id, connectionIdx: index, position: { x: connectionTargetX, y: connectionTargetY }, highlighted: false }) }}
            />
        )

    })

    return (
        <>{items}</>
    );
}