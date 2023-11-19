import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import { IShip } from '@/modules/roboships/ship';
import ShipStateContext,  { IRoboshipsPositionAction, 
                            IProgramComponentToAdd, 
                            IRoboshipsAddProgramComponentAction, 
                            IRoboshipsConnectShipCommandAction,
                            IRoboshipsNumberAction}  from '@/modules/shipstatecontext';
import SVGGrid from './SVGGrid';
import { useDebouncedCallback } from 'use-debounce';
import SVGProgram from './SVGProgram';
import { commandHeight, commandWidth } from './SVGProgramCommand';
import { ISelectedConnection } from './SVGProgramCommand';
import { isPointInsideRect } from '@/modules/roboships/shapeutils';
import SVGScrollBars from './SVGScrollBars';
import ProgramCommandMenu from './ProgramCommandMenu';

interface ILayoutSVGProps {
    selectedShipID: number
    programComponentToAdd: IProgramComponentToAdd
}

const scrollSizeX : number = 1000
const scrollSizeY : number = 1000

export default function ProgramEditorSVG({ selectedShipID, programComponentToAdd }: ILayoutSVGProps) {

    const { state, dispatch } = useContext(ShipStateContext)
    const svgDivRef = useRef<HTMLDivElement | null>(null);
    const [svgSize, setSvgSize] = useState({ height: 1, width: 1 })    
    const [selecteItemType, setSelectedItemType] = useState('')
    const [selectedItemID, setSelectedItemID] = useState(-1)
    const [svgScale, setSVGScale] = useState(7)
    const [svgScrollPos, setSVGScrollPos] = useState({ x: 0, y: 0 })
    const [svgIsMouseDown, setSVGIsMouseDown] = useState(false)
    const [selectedConnection, setSelectedConnection] = useState<ISelectedConnection | null>(null)
    const [showProgramCommandMenu, setShowProgramCommandMenu] = useState(false)
    const [menuTargetCommandId, setMenuTargetCommandId] = useState(-1)
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0})

    const debouncedUpdateDimensions = useDebouncedCallback(        
        () => {
            updateDimensions()
        },        
        50,
        { maxWait: 100 }
      );

    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', debouncedUpdateDimensions);
        return () => {
            window.removeEventListener('resize', debouncedUpdateDimensions);
        };
    }, []);

    const ship: IShip | null = state.ships.find((ship) => ship.id === selectedShipID) || null

    function updateDimensions() {
        if (svgDivRef.current) {
            const divElement = svgDivRef.current;
            const rect = divElement.getBoundingClientRect();

            let height = rect.height - 25;
            let width = rect.width;
            
            setSvgSize({ height: height, width: width });
        }
    }

    function mouseMoveSVG(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
       if(svgIsMouseDown && (selectedItemID === -1  || selecteItemType === '') && selectedConnection === null) 
       {
            // Pan

            let newX = svgScrollPos.x - e.movementX / svgScale
            let newY = svgScrollPos.y - e.movementY / svgScale
                        
            // clamp scroll position
            newX = Math.max(0, Math.min(newX, scrollSizeX-svgSize.width / svgScale));
            newY = Math.max(0, Math.min(newY, scrollSizeY-svgSize.height / svgScale ));

            setSVGScrollPos({x: newX, y: newY})

       
       }       
       else if(selectedConnection !== null)
       {
            let position = ScaleAndSnap(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

            let overCommand = false

            if(ship !== null)
            {

                for(let command of ship.program)
                {
                    if(command.id !== selectedConnection.commandID && isPointInsideRect({x: position.x, y: position.y}, {x: command.position.x, y: command.position.y}, commandWidth, commandHeight))
                    {
                        overCommand = true
                        break;
                    }
                }
            }

            setSelectedConnection({...selectedConnection, position: position, highlighted: overCommand})
       }
       else if(selectedItemID !== -1  && selecteItemType !== '')
       {            
            let position = ScaleAndSnap(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

            if(selecteItemType === 'command') {
                const action: IRoboshipsPositionAction = { actionType: 'move-program-command', shipID: selectedShipID, targetID: selectedItemID, position: position }
                dispatch(action)
            }
        }
        
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
                
        const action: IRoboshipsAddProgramComponentAction = { actionType: 'add-program-component', shipID: selectedShipID, component: programComponentToAdd, position: position }
        dispatch(action)        
    }

    function onWheelSVG(e: React.WheelEvent<SVGSVGElement>) {
       

        let newScale = svgScale + (e.deltaY / 100)
        // clamp scale
        newScale = Math.max(3, Math.min(newScale, 10));
        setSVGScale(newScale)

        let newX = svgScrollPos.x
        let newY = svgScrollPos.y
                    
        // clamp scroll position
        newX = Math.max(0, Math.min(newX, scrollSizeX-svgSize.width / newScale))
        newY = Math.max(0, Math.min(newY, scrollSizeY-svgSize.height / newScale ))

        setSVGScrollPos({x: newX, y: newY})

        
    }

    function onMouseDownSVG(e: React.MouseEvent<SVGSVGElement, MouseEvent>) 
    {      
        if(e.button===0) setSVGIsMouseDown(true)
    }

    function onMouseUpSVG(e: React.MouseEvent<SVGSVGElement, MouseEvent>) 
    {
        if(e.button!==0) return
        
        if(selectedConnection !== null)
        {
            if(ship !== null)
            {

                for(let command of ship.program)
                {
                    if(command.id !== selectedConnection.commandID && isPointInsideRect({x: selectedConnection.position.x, y: selectedConnection.position.y}, {x: command.position.x, y: command.position.y}, commandWidth, commandHeight))
                    {
                        const action: IRoboshipsConnectShipCommandAction = { actionType: 'connect-program-command', shipID: selectedShipID, commandID: selectedConnection.commandID, connectionIdx: selectedConnection.connectionIdx, connectToCommandID: command.id }
                        dispatch(action)
                        break;                      
                    }
                }
            }
        }

        setSelectedItemType(''); 
        setSelectedItemID(-1);  
        setSVGIsMouseDown(false); 
        setSelectedConnection(null) 
    }

    function ScaleAndSnap(inputX: number, inputY: number): { x: number, y: number } {
        let x: number = inputX / svgScale
        let y: number = inputY / svgScale
        x=x+svgScrollPos.x
        y=y+svgScrollPos.y

        // Clamp positions
        x = Math.max(commandWidth/2, Math.min(x, scrollSizeX  - commandWidth/2));
        y = Math.max(commandHeight/2, Math.min(y, scrollSizeY - commandHeight/2));

        return { x: Math.round(x), y: Math.round(y) }
    }    

    function onExecuteMenuCommand(menuTargetCommandId: number, menuCommand: string ) 
    {
      

        const command= ship?.program.find((command) => command.id === menuTargetCommandId)

        if(command !== undefined) 
        {
            switch(menuCommand)
            {
                case 'delete':
                    const action: IRoboshipsNumberAction = { actionType: 'delete-program-command', shipID: selectedShipID, value: menuTargetCommandId }
                    dispatch(action)
                    break;
                case 'disconnect':
                    const action2: IRoboshipsNumberAction = { actionType: 'disconnect-program-command', shipID: selectedShipID, value: menuTargetCommandId }
                    dispatch(action2)
                    break;
                default:
            }
        }
            

        setShowProgramCommandMenu(false)
    }

    function openCommandContextMenu(commandId: number)
    {
        if(ship === null) return;        
        const command = ship.program.find((command) => command.id === commandId)
        if(command === undefined) return;            
        const position = {x: command.position.x * svgScale - svgScrollPos.x * svgScale, y: command.position.y * svgScale - svgScrollPos.y * svgScale}
        
        setMenuPosition(position)
        setMenuTargetCommandId(commandId)
        setShowProgramCommandMenu(true)                    
    }

    return (
    
        <div className='bg-sky-300 max-h-full flex-grow relative' ref={svgDivRef} >            
            <svg className='bg-sky-300 absolute' 
                viewBox={`0 0 ${svgSize.width} ${svgSize.height}`} 
                onMouseMove={mouseMoveSVG} 
                onMouseUp={ onMouseUpSVG } 
                onMouseLeave={() => {setSelectedItemType(''); setSelectedItemID(-1); setSVGIsMouseDown(false); setSelectedConnection(null) }}
                onDragStart={onDragStartSVG} onDragOver={onDragOverSVG} onDrop={onDragDropSVG} 
                onWheel={onWheelSVG}
                onMouseDown={onMouseDownSVG}
            >
                <SVGGrid height={svgSize.height} width={svgSize.width} scale={svgScale} scrollPos={svgScrollPos} />
                {ship !== null && <SVGProgram ship={ship} scale={svgScale} scrollPos={svgScrollPos} 
                                               itemSelected={(itemType, itemId)=>{setSelectedItemType(itemType); setSelectedItemID(itemId) }}
                                               connectionSelected={(selectedConnection)=> setSelectedConnection(selectedConnection) }
                                               selectedConnection={selectedConnection}
                                               openContextMenu={ (commandId) => openCommandContextMenu(commandId)} 
                                               
                /> }

                <SVGScrollBars height={svgSize.height} width={svgSize.width} maxHeight={scrollSizeY} maxWidth={scrollSizeX} scale={svgScale} scrollPos={svgScrollPos} />
            </svg>
            {showProgramCommandMenu && <ProgramCommandMenu menuTargetCommandId={menuTargetCommandId} 
                                                           onExecuteMenuCommand={ (target,command) => onExecuteMenuCommand(target, command)} 
                                                           position={menuPosition} 
                                                           closeMenu={() => setShowProgramCommandMenu(false)} />}
        </div>
      
    )
}