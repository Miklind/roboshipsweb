import { IShipComponent } from "./shipcomponent"
import { IProgramCommand } from "./programcomponents";

let nextShipId = 0

export interface IShip 
{
    id : number
    name : string
    author : string
    description : string
    shipComponents : IShipComponent[]
    program : IProgramCommand[]
}

export function createShip() : IShip
{
    let ship: IShip = { id: getNewShipId(), name: "Untitled", author: "Unknown", description: "", shipComponents: [], program: []}   
    return ship
}

export function getNewShipId() : number
{
    return nextShipId++
}

