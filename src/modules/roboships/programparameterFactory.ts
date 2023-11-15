import { IProgramParameter, createProgramParameter } from "./programcomponents";
import { IParameterDefinition, parameterDefs } from "./programcomponents";


export default class ProgramParameterFactory
{
    static createProgramParameter(parameter: string, targetType: string, targetId: number) : IProgramParameter
    {
        const parameterDef: IParameterDefinition | undefined = parameterDefs.find(c => c.parameter === parameter && c.targetType === targetType) 
        if(parameterDef===undefined) return createProgramParameter()

        let programParameter: IProgramParameter = createProgramParameter()
        programParameter.parameter = parameter
        programParameter.targetType = targetType
        programParameter.targetIdx = targetId
        programParameter.displayTarget = parameterDef.displayTarget
        return programParameter
      
    }     
}

