import { useEffect, useContext, useReducer, use } from 'react'
import SimulationContext,  { ISimulationInitAction, simulationStateReducer } from '@/modules/simulationContext'
import ShipEditorContext from '@/modules/shipEditorContext'
import SimulationSVG from './SimulationSVG'
import SimulationControls from './SimulationControls'
 

export default function SimulationView() {

    const {state, dispatch} = useContext(ShipEditorContext)
    const [simulationState, simulationDispatch] = useReducer(simulationStateReducer, { simTime: 0, simStatus: 'stopped',  ships: [] }) 

    useEffect(() => {        
        const action: ISimulationInitAction = { actionType: 'init-simulation', editorState: state }
        simulationDispatch(action)        
      }, [state]);

    return (

        <div className='bg-base-300 rounded px-2 mt-1 flex flex-col flex-grow'>
            <SimulationContext.Provider value={ {simulationState, simulationDispatch} }>
                <SimulationControls/>
                <SimulationSVG/>
            </SimulationContext.Provider>

    
        </div>
    
      )
  }