import { IProgramParameter, createProgramParameter } from "./programcomponents";
import { IParameterDefinition, parameterDefs } from "./programcomponents";


export default class ProgramParameterFactory
{
    static createProgramParameter(parameter: string, targetType: string, targetIdx: number) : IProgramParameter
    {
        const parameterDef: IParameterDefinition | undefined = parameterDefs.find(c => c.parameter === parameter && c.targetType === targetType) 
        if(parameterDef===undefined) return createProgramParameter()

        let programParameter: IProgramParameter = createProgramParameter()
        programParameter.parameter = parameter
        programParameter.targetType = targetType
        programParameter.targetIdx = targetIdx
        programParameter.displayTarget = parameterDef.displayTarget
        return programParameter
      
    }     
}

