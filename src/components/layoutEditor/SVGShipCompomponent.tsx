import { getPolygonData } from '@/modules/roboships/shipcomponent';
import { IShipComponent } from '@/modules/roboships/shipcomponent';

interface SVGShipComponentProps {
    shipComponent: IShipComponent
    valid: boolean
    scale: number
    componentSelected: (componentID: number) => void
    openContextMenu: (componentID: number) => void
}

export default function SVGShipComponent({ shipComponent, valid, scale, componentSelected, openContextMenu }: SVGShipComponentProps) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    const polygonData = getPolygonData(shipComponent, scale);

    function onCommandContextMenu(e: React.MouseEvent<SVGPolygonElement, MouseEvent>|React.MouseEvent<SVGTextElement, MouseEvent>, componentID: number) {
        e.preventDefault();
        e.stopPropagation();                               
        openContextMenu(componentID)
    }

    return(
    <>
        <polygon
            key={`component-${polygonData.id}`}
            points={polygonData.points}
            transform={polygonData.transform}
            fill={polygonData.fillColor}
            stroke={  valid ?  polygonData.strokeColor : 'red'}
            strokeWidth={scaledToSVG(polygonData.strokeWidth)}
            strokeLinejoin='round'
            onMouseDown={(e) => { if(e.button===0) componentSelected(polygonData.id) }}
            onContextMenu={(e) => onCommandContextMenu(e, shipComponent.id)}
        />
    

        {shipComponent.componentType !== 'hull' &&    
            <text className='select-none' 
                key={`componentText-${polygonData.id}`}
                x={scaledToSVG(shipComponent.position.x)}
                y={scaledToSVG(shipComponent.position.y)}
                style={{ fontSize: `${scaledToSVG(3.5)}px` }}
                fill="black"            
                textAnchor="middle"
                dominantBaseline="middle"
                onMouseDown={(e) => { if(e.button===0) componentSelected(polygonData.id) }}
                onContextMenu={(e) => onCommandContextMenu(e, shipComponent.id)}

                >{shipComponent.componentType}
            </text>
            }            
    </>
    )        
}