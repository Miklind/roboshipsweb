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
  { commandType: "command", command: "Start", targetType: "General", displayTarget:false,  numParameters: 0, numConnections: 1 },  
  { commandType: "command", command: "SetSpeed", targetType: "Ship", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "Ship", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "Gun", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "condition", command: "IsTurning", targetType: "Gun", displayTarget:true, numParameters: 0, numConnections: 2 },
  { commandType: "condition", command: "IsLoading", targetType: "Gun", displayTarget:true, numParameters: 0, numConnections: 2 },
  { commandType: "command", command: "Fire", targetType: "Gun", displayTarget:true, numParameters: 0, numConnections: 1 },
  { commandType: "command", command: "SetHeading", targetType: "Radar", displayTarget:true, numParameters: 1, numConnections: 1 },
  { commandType: "condition", command: "IsDetected", targetType: "Radar", displayTarget:true, numParameters: 0, numConnections: 2 }
  
]

export const parameterDefs: IParameterDefinition[] = [    
    { parameter: "Undefined", targetType: "general", displayTarget:false },
    { parameter: "Const", targetType: "general", displayTarget:false }        
]
