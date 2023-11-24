
import { IProgramCommand, IProgramParameter, getParameterText } from "@/modules/roboships/programcomponents";
import { IPoint, COMMAND_HEIGHT, COMMAND_WIDTH, COMMAND_TITLE_HEIGHT, getParameterPosition } from '@/modules/roboships/shapeutils'


interface ISVGProgramParameterProps {
    scale: number  
    scrollPos: IPoint
    command: IProgramCommand
    parameter: IProgramParameter
    openParamValueEdit: (commandId: number, paramId: number) => void
}

export default function SVGProgramParameter({ scale, command,  parameter, scrollPos, openParamValueEdit } : ISVGProgramParameterProps ) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    const paramIdx=command.parameters.indexOf(parameter)
    if(paramIdx===-1) return <></>

    let paramPos=getParameterPosition(command,paramIdx,false)
    paramPos.position.x-=scrollPos.x
    paramPos.position.y-=scrollPos.y

    return (<>
                <rect 
                x={scaledToSVG(paramPos.position.x + 0.4)} 
                y={scaledToSVG(paramPos.position.y + 0.4)} 
                width={scaledToSVG(paramPos.width-0.8)} 
                height={scaledToSVG(paramPos.height-0.8)} 
                rx={scaledToSVG(1)}  
                stroke="black" 
                fill="lightgray"
                onClick={(e) => { if(e.button==0 && parameter.parameter==="Const") openParamValueEdit(command.id, parameter.id) }}                 
                />   

                <text className='select-none' 
                x={scaledToSVG(paramPos.position.x + paramPos.width/2)} 
                y={scaledToSVG(paramPos.position.y + paramPos.height/2)} 
                style={{ fontSize: `${scaledToSVG(1.8)}px` }} 
                fill="black" 
                textAnchor="middle" 
                dominantBaseline="middle"
                onClick={(e) => { if(e.button==0 && parameter.parameter==="Const") openParamValueEdit(command.id, parameter.id) }}                   
                >
                    {getParameterText(parameter)}
            </text>
    </>);
}