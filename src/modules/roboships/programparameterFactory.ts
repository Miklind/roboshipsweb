import { IProgramParameter, IProgramConstParameter, createProgramParameter, createProgramConstParameter } from "./programcomponents";
import { IParameterDefinition, parameterDefs } from "./programcomponents";


export default class ProgramParameterFactory
{
    static createProgramParameter(parameter: string, targetType: string, targetIdx: number) : IProgramParameter
    {
        const parameterDef: IParameterDefinition | undefined = parameterDefs.find(c => c.parameter === parameter && c.targetType === targetType) 
        if(parameterDef===undefined) return createProgramParameter()


        let programParameter : IProgramParameter

        if(targetType === 'General' && parameter==='Const')
        {   
            programParameter = createProgramConstParameter()            
        }
        else
        {
            programParameter = createProgramParameter()        
        }
                    
        programParameter.parameter = parameter
        programParameter.targetType = targetType
        programParameter.targetIdx = targetIdx                

        return programParameter
              
    }     
}

