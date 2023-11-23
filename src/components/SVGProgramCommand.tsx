import { IProgramCommand, getCommandText } from "@/modules/roboships/programcomponents";
import SVGProgramParameter from "./SVGProgramParameter";
import { IPoint,COMMAND_HEIGHT, COMMAND_WIDTH, COMMAND_TITLE_HEIGHT } from '@/modules/roboships/shapeutils'

interface ISVGProgramCommandProps {
    scale: number  
    command: IProgramCommand
    scrollPos: IPoint
    itemSelected: (itemType: string, itemID: number) => void 
    openContextMenu: (commandID: number) => void
    openParamValueEdit: (commandId: number, paramId: number) => void
}



export default function SVGProgramCommand({  scale, command, scrollPos, itemSelected, openContextMenu, openParamValueEdit } : ISVGProgramCommandProps ) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    function onCommandContextMenu(e: React.MouseEvent<SVGRectElement, MouseEvent>|React.MouseEvent<SVGTextElement, MouseEvent>|React.MouseEvent<SVGPolygonElement, MouseEvent>, commandID: number) {
        e.preventDefault();
        e.stopPropagation();        
        openContextMenu(commandID)
    }
    
    return (
        <>                                
            {command.commandType==="command" && <rect 
                x={scaledToSVG(-scrollPos.x + command.position.x - COMMAND_WIDTH / 2)} 
                y={scaledToSVG(-scrollPos.y + command.position.y - COMMAND_HEIGHT / 2)} 
                width={scaledToSVG(COMMAND_WIDTH)} 
                height={scaledToSVG(COMMAND_HEIGHT)} 
                rx={scaledToSVG(1)}  
                stroke="black" 
                fill="white" 
                onMouseDown={(e) => { if(e.button==0) itemSelected('command', command.id) }}
                onContextMenu={(e) => onCommandContextMenu(e, command.id)}
            />}

            {command.commandType==="condition" && <polygon 
                points={`${scaledToSVG(-scrollPos.x + command.position.x - COMMAND_WIDTH / 2)},${scaledToSVG(-scrollPos.y + command.position.y - COMMAND_HEIGHT / 2 + COMMAND_TITLE_HEIGHT)}
                        ${scaledToSVG(-scrollPos.x + command.position.x - COMMAND_WIDTH / 2 - 2)},${scaledToSVG(-scrollPos.y + command.position.y + COMMAND_TITLE_HEIGHT / 2)}
                         ${scaledToSVG(-scrollPos.x + command.position.x - COMMAND_WIDTH / 2)},${scaledToSVG(-scrollPos.y + command.position.y + COMMAND_HEIGHT / 2)} 
                         ${scaledToSVG(-scrollPos.x + command.position.x + COMMAND_WIDTH / 2)},${scaledToSVG(-scrollPos.y + command.position.y + COMMAND_HEIGHT / 2)} 
                         ${scaledToSVG(-scrollPos.x + command.position.x + COMMAND_WIDTH / 2 + 2)},${scaledToSVG(-scrollPos.y + command.position.y + COMMAND_TITLE_HEIGHT / 2  )} 
                         ${scaledToSVG(-scrollPos.x + command.position.x + COMMAND_WIDTH / 2)},${scaledToSVG(-scrollPos.y + command.position.y - COMMAND_HEIGHT / 2 + COMMAND_TITLE_HEIGHT)}                                                                                     
                        `} 
                stroke="black" 
                fill="white" 
                onMouseDown={(e) => { if(e.button==0) itemSelected('command', command.id) }}
                onContextMenu={(e) => onCommandContextMenu(e, command.id)}
          
                />}
            
            <rect 
                x={scaledToSVG(-scrollPos.x + command.position.x - COMMAND_WIDTH / 2)} 
                y={scaledToSVG(-scrollPos.y + command.position.y - COMMAND_TITLE_HEIGHT/2 - (COMMAND_HEIGHT-COMMAND_TITLE_HEIGHT) / 2)} 
                width={scaledToSVG(COMMAND_WIDTH)} 
                height={scaledToSVG(COMMAND_TITLE_HEIGHT)}   
                stroke="black" 
                fill="lightblue" 
                onMouseDown={(e) => { if(e.button==0) itemSelected('command',command.id) }}
                onContextMenu={(e) => onCommandContextMenu(e, command.id)}
            />           
            
            <text className='select-none' 
                x={scaledToSVG(-scrollPos.x + command.position.x)} 
                y={scaledToSVG(-scrollPos.y + command.position.y - (COMMAND_HEIGHT - COMMAND_TITLE_HEIGHT) / 2)} 
                style={{ fontSize: `${scaledToSVG(2)}px` }} 
                fill="black" 
                textAnchor="middle" 
                dominantBaseline="middle"
                onMouseDown={(e) => { if(e.button==0) itemSelected('command', command.id) }}
                onContextMenu={(e) => onCommandContextMenu(e, command.id)}
                >
                    {getCommandText(command)}
            </text>
      
            {
                command.parameters.map((parameter) => {
                    return <SVGProgramParameter key={parameter.id} 
                                                scale={scale}
                                                scrollPos={scrollPos}
                                                command={command}
                                                parameter={parameter} 
                                                openParamValueEdit={(commandId, paramId) => openParamValueEdit(commandId, paramId)}
                                              />
                })
            
            }
        </>
    );
}