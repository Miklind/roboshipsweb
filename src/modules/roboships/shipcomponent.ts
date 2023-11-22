import { IShip } from "./ship";
import { isPointInsidePolygon } from "./shapeutils";
import { IPoint } from "./shapeutils";

let nextShipComponentId = 0

export function setNextShipComponentId(id: number)
{
    nextShipComponentId = id
}

export interface IShipComponent 
{
    id : number
    componentType : string
    moveable : boolean

    position : IPoint
    
    shape : IPoint[]
    strokeColor : string
    fillColor : string 
    strokeWidth : number           
}

export function getPolygonData(component: IShipComponent, scale: number): { id: number, points: string, transform: string, fillColor: string, strokeColor: string, strokeWidth: number } 
{
    const pointsString = component.shape.map(p => `${p.x * scale},${p.y * scale }`).join(' ');
    return {
        id: component.id,
        points: pointsString,
        transform: ` translate(${component.position.x*scale} ${component.position.y*scale})`,
        fillColor: component.fillColor,
        strokeColor: component.strokeColor,
        strokeWidth: component.strokeWidth
    };
}

export function getSimulationPolygonData(component: IShipComponent, simPos: IPoint, simRotation: number, scale: number): { id: number, points: string, transform: string, fillColor: string, strokeColor: string, strokeWidth: number } 
{
    const pointsString = component.shape.map(p => `${p.x * scale},${p.y * scale }`).join(' ');
    return {
        id: component.id,
        points: pointsString,
        transform: `rotate(${simRotation} ${simPos.x*scale} ${simPos.y*scale} ) translate(${simPos.x*scale} ${simPos.y*scale})`,
        fillColor: component.fillColor,
        strokeColor: component.strokeColor,
        strokeWidth: component.strokeWidth
    };
}

export function createShipComponent() : IShipComponent
{
    let shipComponent: IShipComponent = { id: nextShipComponentId++, componentType: "", moveable: true, position: {x: 0, y: 0}, shape: [], strokeColor: 'black', fillColor: 'white', strokeWidth: 1}
    return shipComponent
}

export function checkComponentPlacement(ship: IShip|null) : boolean[]
{
    if(ship == null) return []

    let result: boolean[] = Array(ship.shipComponents.length).fill(true)
    
    let hull : IShipComponent | null = ship.shipComponents.find(c => c.componentType === 'hull') || null

    for( let componentIdx in ship.shipComponents)
    {
        if(ship.shipComponents[componentIdx] == hull) continue

        let component = ship.shipComponents[componentIdx]

        if(hull !== null)
        {
            if(!isInsideHull(component, hull)) result[componentIdx] = false
            if(isOverLappingExceptHull(component, hull, ship.shipComponents)) result[componentIdx] = false
        }                                        
    }

    return result
}

function isOverLappingExceptHull(component: IShipComponent, hull: IShipComponent, components: IShipComponent[]) : boolean
{    
    for(let otherComponent of components)
    {
        if(otherComponent == component) continue
        if(otherComponent == hull) continue

        for(let point of component.shape)
        {
            let componentPoint= {x: point.x + component.position.x, y: point.y + component.position.y}

            let pointInOtherComponent = isPointInsidePolygon(componentPoint, otherComponent.shape, otherComponent.position)
            if(pointInOtherComponent) 
            {
                return true
            }
        }        
    }

    return false
}

function isInsideHull(component: IShipComponent, hull: IShipComponent) : boolean
{
    if(hull == null) return true
    
    for(let point of component.shape)
    {
        let componentPoint= {x: point.x + component.position.x, y: point.y + component.position.y}

        let pointInHull = isPointInsidePolygon(componentPoint, hull.shape, hull.position)
        if(!pointInHull) 
        {
            return false;            
        }
    }

    return true
}