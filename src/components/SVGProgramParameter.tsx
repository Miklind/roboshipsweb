
import { IProgramCommand, IProgramParameter } from "@/modules/roboships/programcomponents";
import { commandHeight, commandWidth, commmandTitleHeight } from "./SVGProgramCommand";

interface ISVGProgramParameterProps {
    scale: number  
    scrollPos: {x: number, y: number}
    command: IProgramCommand
    parameter: IProgramParameter

   
}

export default function SVGProgramParameter({ scale, command,  parameter, scrollPos } : ISVGProgramParameterProps ) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    const paramIdx=command.parameters.indexOf(parameter)
    if(paramIdx===-1) return <></>

    const width: number = command.parameters.length > 1 ? commandWidth / command.parameters.length : commandWidth
    const height: number = commandHeight - commmandTitleHeight
    const x= -scrollPos.x + command.position.x - commandWidth / 2 + paramIdx * width
    const y= -scrollPos.y + command.position.y - commandHeight / 2 + commmandTitleHeight

    return (<>

                <rect 
                x={scaledToSVG(x + 0.3)} 
                y={scaledToSVG(y + 0.3)} 
                width={scaledToSVG(width-0.6)} 
                height={scaledToSVG(height-0.6)} 
                rx={scaledToSVG(1)}  
                stroke="black" 
                fill="yellow"                 
                />   

                <text className='select-none' 
                x={scaledToSVG(x + width/2)} 
                y={scaledToSVG(y + height/2)} 
                style={{ fontSize: `${scaledToSVG(2)}px` }} 
                fill="black" 
                textAnchor="middle" 
                dominantBaseline="middle"
                
                >
                    {parameter.displayTarget ? `${parameter.targetType}.${parameter.parameter}` : parameter.parameter}
            </text>
    
    
    
    </>);
}