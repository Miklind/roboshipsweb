import { getSimulationPolygonData } from '@/modules/roboships/shipcomponent';
import { IShip } from '@/modules/roboships/ship';
import { ISimulationShipState } from '@/modules/simulationContext';

interface SVGSimulationShipProps {
    scale: number
    ship: IShip
    simShip: ISimulationShipState
}

export default function SVGSimulationShip({ scale, ship, simShip }: SVGSimulationShipProps) {
    const hull = ship.shipComponents.find((component) => component.componentType === 'hull')
    if(!hull) return null;
    
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