import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import { IRoboshipsAddShipComponentAction, IRoboshipsMoveShipComponentAction } from '@/modules/shipstatecontext';
import { IShip } from '@/modules/roboships/ship';
import { IShipComponent, checkComponentPlacement } from '@/modules/roboships/shipcomponent';
import ShipStateContext from '@/modules/shipstatecontext';
import SVGGrid from './SVGGrid';
import SVGShip from './SVGShip';
import { useDebouncedCallback } from 'use-debounce';


interface ILayoutSVGProps {
    selectedShipID: number
    componentTypeToAdd: string
}

export default function LayoutEditorSVG({ selectedShipID, componentTypeToAdd }: ILayoutSVGProps) {

    const { state, dispatch } = useContext(ShipStateContext)

    const svgDivRef = useRef<HTMLDivElement | null>(null);
    const [svgSize, setSvgSize] = useState({ height: 1, width: 1, scale: 1 })
    const [selectedComponentID, setSelectedComponentID] = useState(-1)
    const [componentMoved, setComponentMoved] = useState(false)
    
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

    const ship: IShip | null = state.ships.find((ship) => ship.id === selectedShipID) || null
    const shipComponent: IShipComponent | null = ship?.shipComponents.find((component) => component.id === selectedComponentID) || null

    const validComponents: boolean[] = useMemo(
        () => 
        {
            setComponentMoved(false)
            return checkComponentPlacement(ship)
        },
        [componentMoved]
      );


    function updateDimensionsAndScale() {
        if (svgDivRef.current) {
            const divElement = svgDivRef.current;
            const rect = divElement.getBoundingClientRect();

            let height = rect.height - 25 
            let width = rect.width 
            let scale = height / 100

            if ((width / scale) < 70) {
                scale = width / 70;
            }

            setSvgSize({ height: height, width: width, scale: scale });
        }
    }

    function mouseMoveSVG(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        if (selectedComponentID === -1) return;

        if (shipComponent?.moveable === false) return;

        let position = ScaleAndSnap(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

        const action: IRoboshipsMoveShipComponentAction = { actionType: 'move-ship-component', shipID: selectedShipID, componentID: selectedComponentID, position: position }
        dispatch(action)
        setComponentMoved(true)
    }

    // Disable dragging from svg image 
    function onDragStartSVG(e: React.DragEvent<SVGSVGElement>) {
        e.preventDefault();
    }

    // To disable blocked mouse pointer
    function onDragOverSVG(e: React.DragEvent<SVGSVGElement>) {
        e.preventDefault();
    }

    function onDragDropSVG(e: React.DragEvent<SVGSVGElement>) {
        e.preventDefault();

        let position = ScaleAndSnap(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

        const action: IRoboshipsAddShipComponentAction = { actionType: 'add-ship-component', shipID: selectedShipID, componentType: componentTypeToAdd, position: position }
        dispatch(action)
        setComponentMoved(true)
    }

    function ScaleAndSnap(inputX: number, inputY: number): { x: number, y: number } {
        let x: number = inputX / svgSize.scale
        let y: number = inputY / svgSize.scale

        return { x: Math.round(x), y: Math.round(y) }
    }
              
    return (
        <div className='bg-sky-300 max-h-full flex-grow  relative' ref={svgDivRef} >
            <svg className='bg-sky-300 absolute h-auto' viewBox={`0 0 ${svgSize.width} ${svgSize.height}`} onMouseMove={mouseMoveSVG} onMouseUp={() => setSelectedComponentID(-1)} onMouseLeave={() => setSelectedComponentID(-1)}
                onDragStart={onDragStartSVG} onDragOver={onDragOverSVG} onDrop={onDragDropSVG} >
                <SVGGrid height={svgSize.height} width={svgSize.width} scale={svgSize.scale} scrollPos={{ x:0, y:0} } />
                {ship !== null && <SVGShip scale={svgSize.scale} validComponents={validComponents} ship={ship} componentSelected={(componentID) => setSelectedComponentID(componentID)} />}
            </svg>
        </div>
    )
}