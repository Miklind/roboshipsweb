import { createContext } from 'react'
import { IPoint } from './roboships/shapeutils';
import { IShipEditorState } from './shipEditorContext';

export interface IShipComponentSimulationState {
    id: number
    rotation: number
}

export interface IShipProgramSimulationState {
    currentCommandIdx: number
}

export interface ISimulationShipState {
    shipId: number
    position: IPoint
    rotation: number
    health: number

    program: IShipProgramSimulationState
    components: IShipComponentSimulationState[]
}

export interface ISimulationState {
    simTime: number
    simStatus: 'stopped' | 'running' | 'paused'
    ships: ISimulationShipState[]
}

interface ISimulationStateContext {
    simulationState: ISimulationState;
    simulationDispatch: React.Dispatch<any>;
}

const SimulationContext = createContext<ISimulationStateContext>({} as ISimulationStateContext)

export interface ISimulationAction {
    actionType: string
}

export interface ISimulationInitAction extends ISimulationAction {
    actionType: 'init-simulation'
    editorState: IShipEditorState
}

export function simulationStateReducer(state: ISimulationState, action: ISimulationAction): ISimulationState {

    switch (action.actionType) {
        case 'init-simulation':
            return performInitSimulation(state, action);

        default:
            return state
    }
}

function performInitSimulation(state: ISimulationState, action: ISimulationAction) {
    const initAction = action as ISimulationInitAction;

    let simShips: ISimulationShipState[] = initAction.editorState.ships.map(ship => {
        const simShip: ISimulationShipState = {
            shipId: ship.id,
            position: { x: Math.random() * 1000, y: Math.random() * 1000 },
            rotation: Math.random() * 360,
            health: 100,
            program: {
                currentCommandIdx: 0
            },
            components: ship.shipComponents.map(component => {
                const simComponent: IShipComponentSimulationState = {
                    id: component.id,
                    rotation: 0
                }
                return simComponent
            })
        }
        return simShip
    })

    

    const newState: ISimulationState = {
        simTime: 0,
        simStatus: 'stopped',
        ships: simShips
    }

    return newState;
}

export default SimulationContext