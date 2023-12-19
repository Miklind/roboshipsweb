import { IShipEditorState } from "@/modules/shipEditorContext"
import { ISimulationState, ISimulationShipState } from "../simulationContext"
import { News_Cycle } from "next/font/google"
import { IPoint } from "./shapeutils"
import { dir } from "console"



function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function cloneSimulationState(state: ISimulationState): ISimulationState {
    
    let newShips = state.ships.map(ship => {
        let cloneComponents = ship.components.map(component => {
            return { ...component }
        })

        let cloneProgram = { ...ship.program }

        return { ...ship, components: cloneComponents, program: cloneProgram }
    })
    let newState = { ...state, ships: newShips }
    return newState
}

export function simulate(simState: ISimulationState, editorState: IShipEditorState, deltaTime: number): ISimulationState {
        
    let newSimState : ISimulationState = cloneSimulationState(simState)
 
    newSimState.ships.forEach(ship => {
        let moveDirection : IPoint = { x: Math.sin(degreesToRadians(ship.rotation)), y: -Math.cos(degreesToRadians(ship.rotation)) } 
        ship.position.x += moveDirection.x * ship.speed * deltaTime;
    })

    newSimState.simTime += deltaTime

    return newSimState
}