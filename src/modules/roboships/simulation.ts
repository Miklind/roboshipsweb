import { IShipEditorState } from "@/modules/shipEditorContext"
import { ISimulationState, ISimulationShipState } from "../simulationContext"
import { News_Cycle } from "next/font/google"
import { IPoint } from "./shapeutils"
import { dir } from "console"

const SIMTICK = 1

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function simulateStep(simState: ISimulationState, editorState: IShipEditorState): ISimulationState {
    let newsimState : ISimulationState = { simTime: simState.simTime + SIMTICK, ships: []}
 
    newsimState.ships = simState.ships.map(ship => {

       let moveDirection : IPoint = { x: Math.sin(degreesToRadians(ship.rotation)), y: -Math.cos(degreesToRadians(ship.rotation)) }
        
       return { ...ship, position: { x: clamp(ship.position.x + SIMTICK * ship.speed * moveDirection.x,0,1000), y: clamp(ship.position.y + SIMTICK * ship.speed * moveDirection.y,0,1000) }}        

       
    })
 
    return newsimState
}