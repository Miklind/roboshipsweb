import { ICommmandDefinition, IParameterDefinition, commandDefs, parameterDefs } from "@/modules/roboships/programcomponents";
import { useMemo } from "react";

interface IProgramPaletteProps {
    onComponentDrag: (programComponentType: string, programComponent: string, programComponentTarget: string) => void
}

export default function ProgramPalette({ onComponentDrag }: IProgramPaletteProps) {

    function onDragStartList(e: React.DragEvent<HTMLLIElement>, programComponentType: string, programComponent: string, programComponentTarget: string) {
               
        onComponentDrag(programComponentType,programComponent,programComponentTarget);
    }

    const paletteItems: [target: string, commmands: ICommmandDefinition[], parameters: IParameterDefinition[]][] = useMemo(() => {
                
        const targetTypes: Set<string> = new Set();

        commandDefs.forEach(command => targetTypes.add(command.targetType));
        parameterDefs.forEach(parameter => targetTypes.add(parameter.targetType));

        const sortedTargetTypes = Array.from(targetTypes).sort();

        let result: [string, ICommmandDefinition[], IParameterDefinition[]][] = [];

        for (const target of sortedTargetTypes) {
            let matchingCommands = commandDefs.filter(command => command.targetType === target);
            let matchingParameters = parameterDefs.filter(parameter => parameter.targetType === target);

            matchingCommands.sort((a, b) => a.command.localeCompare(b.command));
            matchingParameters.sort((a, b) => a.parameter.localeCompare(b.parameter));

            result.push([target, matchingCommands, matchingParameters]);
        }

        return result

    }, []);

    return (
        <div className='bg-base-200 w-48 m-1 rounded flex flex-col'>
            <div className="text-center text-sm bg-base-300">Drag commands to design view. Use right mouse button to delete/disconnect.</div>
            <ul className='flex-grow m-1 rounded p-1 list-none basis-0 overflow-auto'>

                {paletteItems.map((item) => (
                    <li key={item[0]}>
                        <p className='font-bold'>{item[0]}</p>
                        <ul className='flex-grow m-1 rounded p-1 list-none'>

                            {item[1].map((command) => (
                                <li key={`${item[0]}${command.command}`} className='bg-gray-300 rounded m-1 p-1 cursor-pointer' draggable onDragStart={(e) => onDragStartList(e, "command", command.command, item[0])}>
                                    {command.command}
                                </li>
                            ))}

                            {item[2].map((parameter) => (
                                <li key={`${item[0]}${parameter.parameter}`} className='bg-gray-400 rounded m-1 p-1 cursor-pointer' draggable onDragStart={(e) => onDragStartList(e, "parameter", parameter.parameter, item[0])}>
                                    {parameter.parameter}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}