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
    displayTarget: boolean
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
    displayTarget: boolean     
}

export function createProgramCommand() : IProgramCommand
{
    let programCommand: IProgramCommand = { id: nextProgramCommandId++, commandType: "", targetType: "", command: "", targetIdx: -1, parameters: [], connectedTo: [],position: {x: 0, y: 0}, displayTarget: true }
    return programCommand
}

export function createProgramParameter() : IProgramParameter
{
    let programParameter: IProgramParameter = { id: nextProgramParameterId++, targetType: "", parameter: "", targetIdx: -1, displayTarget: true }
    return programParameter
}

export interface ICommmandDefinition
{
    commandType: string
    command: string
    targetType: string
    numParameters: number
    numConnections: number
    displayTarget: boolean
}

export interface IParameterDefinition
{
    parameter: string 
    targetType: string  
    displayTarget: boolean 
}

export const commandDefs: ICommmandDefinition[] = [  
  { commandType: "command", command: "Start", targetType: "general", displayTarget:false,  numParameters: 0, numConnections: 1 },  
  { commandType: "command", command: "SetSpeed", targetType: "ship", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "ship", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "gun", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "IsTurning", targetType: "gun", displayTarget:true, numParameters: 0, numConnections: 2 },
  { commandType: "command", command: "IsLoading", targetType: "gun", displayTarget:true, numParameters: 0, numConnections: 2 },
  { commandType: "command", command: "Fire", targetType: "gun", displayTarget:true, numParameters: 0, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "radar", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "IsDetected", targetType: "radar", displayTarget:true, numParameters: 0, numConnections: 2 }
  
]

export const parameterDefs: IParameterDefinition[] = [    
    { parameter: "Undefined", targetType: "general", displayTarget:false },
    { parameter: "Const", targetType: "general", displayTarget:false }        
]
