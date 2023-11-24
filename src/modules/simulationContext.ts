import { createContext } from 'react'
import { IPoint } from './roboships/shapeutils';
import { IShipEditorState } from './shipEditorContext';
import { DESIGN_ORIGO } from './shipEditorContext';
import { News_Cycle } from 'next/font/google';

export interface IShipComponentSimulationState {
    id: number
    rotation: number
    targetRotation: number
    position: IPoint
}

export interface IShipProgramSimulationState {
    currentCommandIdx: number
}

export interface ISimulationShipState {
    shipId: number
    position: IPoint
    rotation: number
    targetRotation: number
    speed: number
    targetSpeed: number
    health: number

    program: IShipProgramSimulationState
    components: IShipComponentSimulationState[]
}

export interface ISimulationState {
    simTime: number  
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

export interface ISimulationUpdateAction extends ISimulationAction {
    actionType: 'update-simulation'
    simState: ISimulationState
}

export function simulationStateReducer(state: ISimulationState, action: ISimulationAction): ISimulationState {

    switch (action.actionType) {
        case 'init-simulation':
            return performInitSimulation(state, action);

        case 'update-simulation':
            return performUpdateSimulation(state, action);


        default:
            return state
    }
}

function performUpdateSimulation(state: ISimulationState, action: ISimulationAction) {
   
    const updateAction = action as ISimulationUpdateAction;
    const newState= {...updateAction.simState}
    return newState;
}

function performInitSimulation(state: ISimulationState, action: ISimulationAction) {
    const initAction = action as ISimulationInitAction;

  

    let simShips: ISimulationShipState[] = initAction.editorState.ships.map(ship => {

        const shipRotation = Math.random() * 360

        const simShip: ISimulationShipState = {
            shipId: ship.id,
            position: { x: Math.random() * 1000, y: Math.random() * 1000 },
            rotation: shipRotation,
            targetRotation: shipRotation,
            speed: 1,
            targetSpeed: 1,
            health: 100,
            program: {
                currentCommandIdx: 0
            },
            components: ship.shipComponents.map(component => {
                const simComponent: IShipComponentSimulationState = {
                    id: component.id,
                    position: { x: component.position.x - DESIGN_ORIGO.x , y: component.position.y - DESIGN_ORIGO.y },
                    rotation: 0,
                    targetRotation: 0
                }
                return simComponent
            })
        }
        return simShip
    })

    

    const newState: ISimulationState = {
        simTime: 0,
        ships: simShips
    }

    return newState;
}

export default SimulationContext