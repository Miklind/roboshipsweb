import { IProgramCommand } from "@/modules/roboships/programcomponents";
import SVGProgramParameter from "./SVGProgramParameter";

interface ISVGProgramCommandProps {
    scale: number  
    command: IProgramCommand
    scrollPos: {x: number, y: number}
    itemSelected: (itemType: string, itemID: number) => void 

}

export interface ISelectedConnection 
{
    commandID: number
    connectionIdx: number
    position: {x: number, y: number}
    highlighted: boolean    
}

export const commandWidth: number = 32
export const commandHeight: number = 8
export const commmandTitleHeight: number = 3

export default function SVGProgramCommand({  scale, command, scrollPos, itemSelected } : ISVGProgramCommandProps ) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    return (
        <>                                
            <rect 
                x={scaledToSVG(-scrollPos.x + command.position.x - commandWidth / 2)} 
                y={scaledToSVG(-scrollPos.y + command.position.y - commandHeight / 2)} 
                width={scaledToSVG(commandWidth)} 
                height={scaledToSVG(commandHeight)} 
                rx={scaledToSVG(1)}  
                stroke="black" 
                fill="white" 
                onMouseDown={() => { itemSelected('command', command.id) }}
            />           
            
            <rect 
                x={scaledToSVG(-scrollPos.x + command.position.x - commandWidth / 2)} 
                y={scaledToSVG(-scrollPos.y + command.position.y - commmandTitleHeight/2 - (commandHeight-commmandTitleHeight) / 2)} 
                width={scaledToSVG(commandWidth)} 
                height={scaledToSVG(commmandTitleHeight)}   
                stroke="black" 
                fill="lightblue" 
                onMouseDown={() => { itemSelected('command',command.id) }}
            />           
            
            <text className='select-none' 
                x={scaledToSVG(-scrollPos.x + command.position.x)} 
                y={scaledToSVG(-scrollPos.y + command.position.y - (commandHeight - commmandTitleHeight) / 2)} 
                style={{ fontSize: `${scaledToSVG(2)}px` }} 
                fill="black" 
                textAnchor="middle" 
                dominantBaseline="middle"
                onMouseDown={() => { itemSelected('command', command.id) }}
                >
                    {command.displayTarget ? `${command.targetType}.${command.command}` : command.command }
            </text>
      
            {
                command.parameters.map((parameter, index) => {
                    return <SVGProgramParameter key={parameter.id} 
                                                scale={scale}
                                                scrollPos={scrollPos}
                                                command={command}
                                                parameter={parameter} 
                                              />
                })
            
            }

            


            

        </>
    );
}