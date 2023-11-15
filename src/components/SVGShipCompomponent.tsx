import { getPolygonData } from '@/modules/roboships/shipcomponent';
import { IShipComponent } from '@/modules/roboships/shipcomponent';

interface SVGShipComponentProps {
    shipComponent: IShipComponent
    valid: boolean
    scale: number
    componentSelected: (componentID: number) => void
}

export default function SVGShipComponent({ shipComponent, valid, scale, componentSelected }: SVGShipComponentProps) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    const polygonData = getPolygonData(shipComponent, scale);

    return(
    <>
        <polygon
            key={`component-${polygonData.id}`}
            points={polygonData.points}
            transform={polygonData.transform}
            fill={polygonData.fillColor}
            stroke={  valid ?  polygonData.strokeColor : 'red'}
            strokeWidth={polygonData.strokeWidth}
            strokeLinejoin='round'
            onMouseDown={() => { componentSelected(polygonData.id) }}
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
                onMouseDown={() => { componentSelected(polygonData.id) }}
                >{shipComponent.componentType}
            </text>
            }            
    </>
    )        
}