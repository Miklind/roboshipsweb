import { getSimulationPolygonData } from '@/modules/roboships/shipcomponent';
import { IShip } from '@/modules/roboships/ship';
import { ISimulationShipState } from '@/modules/simulationContext';

interface SVGSimulationShipProps {
    scale: number
    ship: IShip
    simShip: ISimulationShipState
}

export default function SVGSimulationShip({ scale, ship, simShip }: SVGSimulationShipProps) {
    let findHull = ship.shipComponents.filter((c) => c.componentType === 'hull')
    if(findHull.length !== 1) { return null }

    const hull = findHull[0]
    const polygonData = getSimulationPolygonData(hull, simShip.position,simShip.rotation, scale);
    
    return (<>
        <polygon
            
            points={polygonData.points}
            transform={polygonData.transform}
            fill={polygonData.fillColor}
            stroke={  polygonData.strokeColor }
            strokeWidth={polygonData.strokeWidth}
            strokeLinejoin='round'            
        />
    </>)
}