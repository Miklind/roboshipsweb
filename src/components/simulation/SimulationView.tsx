import { useEffect, useContext, useReducer, useState, useRef } from 'react'
import SimulationContext, { ISimulationInitAction, ISimulationUpdateAction, simulationStateReducer } from '@/modules/simulationContext'
import ShipEditorContext from '@/modules/shipEditorContext'
import SimulationSVG from './SimulationSVG'
import SimulationControls from './SimulationControls'
import { simulateStep } from '@/modules/roboships/simulation'


export default function SimulationView() {

    const { state, dispatch } = useContext(ShipEditorContext)
    const [simulationState, simulationDispatch] = useReducer(simulationStateReducer, { simTime: 0, ships: [] })
    const [ simulationRunState, setSimulationRunState ] = useState('paused')
    const simulationStateRef = useRef(simulationState);

    simulationStateRef.current = simulationState;

    useEffect(() => {
        const action: ISimulationInitAction = { actionType: 'init-simulation', editorState: state }
        simulationDispatch(action)
    }, [state]);

    useEffect(() => {

        if(simulationRunState !== 'playing') return
        
        let frameId: number;

        const update = (timestamp: DOMHighResTimeStamp) => {                                                
            let newSimState = simulateStep(simulationStateRef.current, state)                  
            
            const action: ISimulationUpdateAction = { actionType: 'update-simulation', simState: newSimState }
            simulationDispatch(action)
            frameId = requestAnimationFrame(update);
        };

        frameId = requestAnimationFrame(update);

        return () => { cancelAnimationFrame(frameId) };
    }, [simulationRunState]);

    function stopSimulation() {
        setSimulationRunState("stopped")
        const action: ISimulationInitAction = { actionType: 'init-simulation', editorState: state }
        simulationDispatch(action)
    }

    return (

        <div className='bg-base-300 rounded px-2 mt-1 flex flex-col flex-grow'>
            <SimulationContext.Provider value={{ simulationState, simulationDispatch }}>
                <SimulationControls simtime={simulationState.simTime} onPlay={ () => setSimulationRunState("playing") } onPause={ () => setSimulationRunState("paused") } onStop={ () => stopSimulation()}/>
                <SimulationSVG />
            </SimulationContext.Provider>
        </div>

    )
}