import React, { useRef, useState, useContext, useEffect } from 'react';
import ShipEditorContext from '@/modules/shipEditorContext';
import SimulationContext from '@/modules/simulationContext'
import SVGGrid from './SVGGrid';
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
    

    return (
        <div className='bg-sky-300 max-h-full flex-grow  relative' ref={svgDivRef} >
            <svg className='bg-sky-300 absolute h-auto' viewBox={`0 0 ${svgSize.width} ${svgSize.height}`} >
                <SVGGrid height={svgSize.height} width={svgSize.width} scale={svgSize.scale} scrollPos={{ x:0, y:0}} gridInterval={100} />                                
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