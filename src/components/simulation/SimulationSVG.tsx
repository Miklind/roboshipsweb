import React, { useRef, useState, useContext, useEffect } from 'react';
import ShipEditorContext from '@/modules/shipEditorContext';
import SimulationContext from '@/modules/simulationContext'
import SVGGrid from '../SVGGrid';
import { useDebouncedCallback } from 'use-debounce';
import SVGSimulationShip from './SVGSimulationShip';
import { IShip } from '@/modules/roboships/ship';

export default function SimulationSVG() {
    const { state, dispatch } = useContext(ShipEditorContext)
    const { simulationState, simulationDispatch } = useContext(SimulationContext)

    const svgDivRef = useRef<HTMLDivElement | null>(null);
    const [svgSize, setSvgSize] = useState({ height: 1, width: 1, scale: 1 })

    const debouncedUpdateDimensions = useDebouncedCallback(        
        () => {
            updateDimensionsAndScale()
        },        
        50,
        { maxWait: 100 }
      );

    useEffect(() => {
        updateDimensionsAndScale();
        window.addEventListener('resize', debouncedUpdateDimensions);
        return () => {
            window.removeEventListener('resize', debouncedUpdateDimensions);
        };
    }, []);

    function updateDimensionsAndScale() {
        if (svgDivRef.current) {
            const divElement = svgDivRef.current;
            const rect = divElement.getBoundingClientRect();

            let height = rect.height - 25 
            let width = rect.width 
            let scale = height / 1000

            if ((width / scale) < 1000) {
                scale = width / 1000;
            }

            setSvgSize({ height: height, width: width, scale: scale });
        }
    }

    function scaledToSVG(n: number): number {
        return n * svgSize.scale;
    }
    
    return (
        <div className='bg-sky-300 max-h-full flex-grow  relative' ref={svgDivRef} >
            <svg className='bg-sky-300 absolute h-auto' viewBox={`0 0 ${svgSize.width} ${svgSize.height}`} >
                <SVGGrid height={scaledToSVG(999)} width={scaledToSVG(999)} scale={svgSize.scale} scrollPos={{ x:0, y:0}} gridInterval={100} />  
                <line x1={scaledToSVG(0)} y1={scaledToSVG(3)} x2={scaledToSVG(1000)} y2={scaledToSVG(3)} stroke="darkblue" strokeWidth={scaledToSVG(5)} />
                <line x1={scaledToSVG(0)} y1={scaledToSVG(997)} x2={scaledToSVG(1000)} y2={scaledToSVG(997)} stroke="darkblue" strokeWidth={scaledToSVG(5)} />
                <line x1={scaledToSVG(3)} y1={scaledToSVG(0)} x2={scaledToSVG(3)} y2={scaledToSVG(1000)} stroke="darkblue" strokeWidth={scaledToSVG(5)} />
                <line x1={scaledToSVG(997)} y1={scaledToSVG(0)} x2={scaledToSVG(997)} y2={scaledToSVG(1000)} stroke="darkblue" strokeWidth={scaledToSVG(5)} />
                
                
                { simulationState.ships.map((simShip) => 
                {                    
                    let ship: IShip|undefined = state.ships.find((s) => s.id === simShip.shipId);
                    if (!ship) {
                        return null;
                    }
                    return <SVGSimulationShip key={simShip.shipId} scale={svgSize.scale} ship={ship} simShip={simShip} />
                })}
            </svg>          
        </div>
    )
}