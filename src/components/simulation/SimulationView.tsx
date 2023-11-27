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
    
    const frameIdRef = useRef(-1);
    const previousTimeRef = useRef(-1);
    const simulationStateRef = useRef(simulationState);
    


    useEffect(() => {
        simulationStateRef.current = simulationState;
    }, [simulationState]);

    useEffect(() => {
        const action: ISimulationInitAction = { actionType: 'init-simulation', editorState: state }
        simulationDispatch(action)
    }, [state]);

    useEffect(() => {
        
        if(simulationRunState !== 'playing') return
                
        const update = (timestamp: DOMHighResTimeStamp) => {                                                
            
            if(previousTimeRef.current !== -1) 
            {
                const deltatime = timestamp - previousTimeRef.current;
                console.log(deltatime)

                let newSimState = simulateStep(simulationStateRef.current, state, deltatime/1000)                              
                const action: ISimulationUpdateAction = { actionType: 'update-simulation', simState: newSimState }
                simulationDispatch(action)
            }
            frameIdRef.current = requestAnimationFrame(update);
            
            previousTimeRef.current = timestamp;    
        };

        frameIdRef.current = requestAnimationFrame(update);

        return () => { cancelAnimationFrame(frameIdRef.current) };
    }, [simulationRunState]);

    function stopSimulation() {
        setSimulationRunState("stopped")
        const action: ISimulationInitAction = { actionType: 'init-simulation', editorState: state }
        simulationDispatch(action)
    }

    return (

        <div className='bg-base-300 rounded px-2 mt-1 flex flex-col flex-grow'>
            <SimulationContext.Provider value={{ simulationState, simulationDispatch }}>
                <SimulationControls simtime={simulationState.simTime} onPlay={ () => { setSimulationRunState("playing"); previousTimeRef.current=-1 } } onPause={ () => {setSimulationRunState("paused"); previousTimeRef.current = -1 } } onStop={ () => stopSimulation()}/>
                <SimulationSVG />
            </SimulationContext.Provider>
        </div>

    )
}