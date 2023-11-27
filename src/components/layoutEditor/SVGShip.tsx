import { getPolygonData } from '@/modules/roboships/shipcomponent';
import { IShip } from '@/modules/roboships/ship';
import SVGShipComponent from './SVGShipCompomponent';

interface SVGShipProps {
    scale: number
    validComponents: boolean[]
    ship: IShip
    componentSelected: (componentID: number) => void
    openContextMenu: (componentId: number) => void
}

export default function SVGShip({ scale, validComponents, ship, componentSelected, openContextMenu }: SVGShipProps) {

    return (<>
        {ship.shipComponents.map((component, index) => {
            const polygonData = getPolygonData(component, scale);        
            return <SVGShipComponent key={component.id} 
                                     shipComponent={component} 
                                     valid={validComponents[index]} 
                                     scale={scale} 
                                     componentSelected={componentSelected} 
                                     openContextMenu={ (componentId) => { openContextMenu(componentId)}}
                                     />
        })}
    </>)
}