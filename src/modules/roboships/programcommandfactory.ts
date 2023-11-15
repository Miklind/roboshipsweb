import { IProgramCommand, IProgramParameter, createProgramCommand, ICommmandDefinition, commandDefs } from "./programcomponents";
import { IPoint } from "./shapeutils";
import ProgramParameterFactory from "./programparameterFactory";

export default class ProgramCommandFactory
{
    static createProgramCommand(command: string, targetType: string, targetIdx: number) : IProgramCommand
    {
        const commandDef: ICommmandDefinition | undefined = commandDefs.find(c => c.command === command && c.targetType === targetType) 
        if(commandDef===undefined) return createProgramCommand()

        return ProgramCommandBuilder.create()
        .withCommand(command)
        .withTargetType(targetType)                        
        .withTargetIdx(targetIdx)
        .withCommandType(commandDef.commandType)
        .withNumParameters(commandDef.numParameters)
        .withNumConnections(commandDef.numConnections)
        .withDisplayTarget(commandDef.displayTarget)
        .build()
    }     
}

class ProgramCommandBuilder
{
    commandType: string = ""   
    targetType : string = ""
    command: string = ""
    targetIdx: number = -1            
    parameters: IProgramParameter[] = []
    connectedTo: number[] = []
    position : IPoint = {x: 0, y: 0}     
    displayTarget: boolean = true  

    private constructor() {}

    static create(): ProgramCommandBuilder {
        return new ProgramCommandBuilder();
    }

    public withCommandType(commandType: string) : ProgramCommandBuilder
    {
        this.commandType = commandType      
        return this
    }

    public withTargetType(targetType: string) : ProgramCommandBuilder
    {
        this.targetType = targetType
        return this
    }

    public withCommand(command: string) : ProgramCommandBuilder
    {
        this.command = command
        return this
    }

    public withTargetIdx(tergetIdx: number) : ProgramCommandBuilder
    {
        this.targetIdx = tergetIdx
        return this
    }

    public weithPosition(x: number, y: number) : ProgramCommandBuilder
    {
        this.position = {x: x, y: y}
        return this
    }

    public withNumParameters(numParameters: number) : ProgramCommandBuilder
    {
        for(let i = 0; i < numParameters; i++)
        {
            this.parameters.push(ProgramParameterFactory.createProgramParameter("Undefined", "general", -1))
        }
        return this
    }

    public withNumConnections(numConnections: number) : ProgramCommandBuilder
    {
        for(let i = 0; i < numConnections; i++)
        {
            this.connectedTo.push(-1)
        }
        return this
    }

    public withDisplayTarget(displayTarget: boolean) : ProgramCommandBuilder
    {
        this.displayTarget = displayTarget
        return this
    }

    public build() : IProgramCommand
    {
        let programCommand = createProgramCommand()
        programCommand.command = this.command
        programCommand.commandType = this.commandType
        programCommand.targetType = this.targetType        
        programCommand.targetIdx = this.targetIdx
        programCommand.parameters = this.parameters
        programCommand.connectedTo = this.connectedTo
        programCommand.position = this.position
        programCommand.displayTarget = this.displayTarget
        return programCommand      
    }
}