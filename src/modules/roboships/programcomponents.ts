import { IPoint } from "./shapeutils";

let nextProgramCommandId = 0
let nextProgramParameterId = 0

export function setNextProgramCommandId(id: number)
{
    nextProgramCommandId = id
}

export function setNextProgramParameterId(id: number)
{
    nextProgramParameterId = id
}

export interface IProgramParameter
{
    id : number  
    parameter: string
    targetType : string    
    targetIdx: number   
}

export interface IProgramConstParameter extends IProgramParameter
{
    value: number
}

export interface IProgramCommand
{
    id : number
    command: string
    commandType: string    
    targetType : string   
    targetIdx: number            
    parameters: IProgramParameter[]
    connectedTo: number[]
    position : IPoint    
}

export function createProgramCommand() : IProgramCommand
{
    let programCommand: IProgramCommand = { id: nextProgramCommandId++, commandType: "", targetType: "", command: "", targetIdx: -1, parameters: [], connectedTo: [],position: {x: 0, y: 0} }
    return programCommand
}

export function createProgramParameter() : IProgramParameter
{
    let programParameter: IProgramParameter = { id: nextProgramParameterId++, targetType: "", parameter: "", targetIdx: -1 }
    return programParameter
}

export function createProgramConstParameter() : IProgramParameter
{
    let programParameter: IProgramConstParameter = { id: nextProgramParameterId++, targetType: "", parameter: "", targetIdx: -1, value: 0 }
    return programParameter
}

export interface ICommmandDefinition
{
    commandType: string
    command: string
    targetType: string
    numParameters: number
    numConnections: number

}

export interface IParameterDefinition
{
    parameter: string 
    targetType: string  

}

export const commandDefs: ICommmandDefinition[] = [  
  { commandType: "command", command: "Start", targetType: "General",  numParameters: 0, numConnections: 1 },  
  { commandType: "command", command: "SetSpeed", targetType: "Ship", numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "Ship", numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "Gun",  numParameters: 1, numConnections: 1 },
  { commandType: "condition", command: "IsTurning", targetType: "Gun", numParameters: 0, numConnections: 2 },
  { commandType: "condition", command: "IsLoading", targetType: "Gun", numParameters: 0, numConnections: 2 },
  { commandType: "command", command: "Fire", targetType: "Gun", numParameters: 0, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "Radar", numParameters: 1, numConnections: 1 },
  { commandType: "condition", command: "IsDetected", targetType: "Radar", numParameters: 0, numConnections: 2 }
  
]

export const parameterDefs: IParameterDefinition[] = [    
    { parameter: "Const", targetType: "General" }        
]

export function getParameterText(parameter: IProgramParameter) : string
{
    if(parameter.targetType === "General" && parameter.parameter === "Const")
    {
        return (parameter as IProgramConstParameter).value.toString()
    }
    else if(parameter.targetType === "General")
    {
        return parameter.parameter
    }
        
    return `${parameter.targetType}.${parameter.parameter}`
    
}

export function getCommandText(command: IProgramCommand) : string
{
    if(command.targetType === "General")
    {
        return command.command
    }


    return `${command.targetType}.${command.command}`
}