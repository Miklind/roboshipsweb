import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import { IShip } from '@/modules/roboships/ship';
import ShipEditorContext,  { IRoboshipsPositionAction, 
                            IProgramComponentToAdd, 
                            IRoboshipsAddProgramComponentAction, 
                            IRoboshipsConnectShipCommandAction,
                            IRoboshipsNumberAction,
                            IRoboshipsSetParameterAction,
                            IRoboshipsSetConstParameterAction}  from '@/modules/shipEditorContext';
import SVGGrid from './SVGGrid';
import { useDebouncedCallback } from 'use-debounce';
import SVGProgram from './SVGProgram';
import { COMMAND_HEIGHT, COMMAND_WIDTH, COMMAND_TITLE_HEIGHT } from '@/modules/roboships/shapeutils'
import { ISelectedConnection } from './SVGProgramCommandConnection';
import { IPoint, isPointInsideRect, getParameterPosition } from '@/modules/roboships/shapeutils';
import SVGScrollBars from './SVGScrollBars';
import ProgramCommandMenu from './ProgramCommandMenu';
import { IProgramCommand, IProgramConstParameter, IProgramParameter } from '@/modules/roboships/programcomponents';
import ConstValueEdit from "./ConstValueEdit";

interface IProgramCommandMenuParams
{
    show: boolean
    commandId: number
    position: IPoint
}

interface IConstEditParams
{
    showConstEdit: boolean
    commandId: number
    paramId: number
    position: IPoint
}

interface IProgramEditorSVGProps {
    selectedShipID: number
    programComponentToAdd: IProgramComponentToAdd
}

const scrollSizeX : number = 1000
const scrollSizeY : number = 1000

export default function ProgramEditorSVG({ selectedShipID, programComponentToAdd }: IProgramEditorSVGProps) {

    const { state, dispatch } = useContext(ShipEditorContext)
    const svgDivRef = useRef<HTMLDivElement | null>(null);
    const [svgSize, setSvgSize] = useState({ height: 1, width: 1 })    
    const [selecteItemType, setSelectedItemType] = useState('')
    const [selectedItemID, setSelectedItemID] = useState(-1)
    const [svgScale, setSVGScale] = useState(7)
    const [svgScrollPos, setSVGScrollPos] = useState({ x: 0, y: 0 })
    const [svgIsMouseDown, setSVGIsMouseDown] = useState(false)
    const [selectedConnection, setSelectedConnection] = useState<ISelectedConnection | null>(null)
    const [programCommandMenu, setProgramCommandMenu] = useState<IProgramCommandMenuParams>({show: false, commandId: -1, position: {x: 0, y: 0}})
    const [constEdit, setConstEdit] = useState<IConstEditParams>({showConstEdit: false, commandId: -1, paramId: -1, position: {x: 0, y: 0}})

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

    function mouseOverCommand(x: number, y: number, exceptCommandId?: number) : IProgramCommand | null
    {
        if(exceptCommandId === undefined) exceptCommandId = -1

        if(ship !== null)
        {
            for(let command of ship.program)
            {
                if(command.id !== exceptCommandId && isPointInsideRect({x: x, y: y}, {x: command.position.x, y: command.position.y}, COMMAND_WIDTH, COMMAND_HEIGHT))
                {
                    return command
                    break;                      
                }
            }
        }

        return null
    }

    function mouseOverCommandOrParameter(x: number, y: number, exceptCommandId?: number) : { command: IProgramCommand|null, param: IProgramParameter|null}
    {
        if(exceptCommandId === undefined) exceptCommandId = -1
        let resultCommand=mouseOverCommand(x, y, exceptCommandId)
        if(resultCommand === null) return {command: null, param: null}
               
        for(let paramIdx=0; paramIdx<resultCommand.parameters.length; paramIdx++)
        {       
            const paramPos = getParameterPosition(resultCommand, paramIdx, true)
                      
            if(isPointInsideRect({x: x, y: y}, {x: paramPos.position.x, y: paramPos.position.y}, paramPos.width, paramPos.height))
            {
                return {command: resultCommand, param: resultCommand.parameters[paramIdx]}                
            }
        }
            
        return {command: resultCommand, param: null}
        
    }

    function mouseMoveSVG(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
       if(svgIsMouseDown && (selectedItemID === -1  || selecteItemType === '') && selectedConnection === null) 
       {
            // Nothing selected - Pan view

            let newX = svgScrollPos.x - e.movementX / svgScale
            let newY = svgScrollPos.y - e.movementY / svgScale
                        
            // clamp scroll position
            newX = Math.max(0, Math.min(newX, scrollSizeX-svgSize.width / svgScale));
            newY = Math.max(0, Math.min(newY, scrollSizeY-svgSize.height / svgScale ));

            setSVGScrollPos({x: newX, y: newY})       
       }       
       else if(selectedConnection !== null)
       {
            // Moving connection

            let position = ScaleAndSnap(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            let overCommand = mouseOverCommand(position.x, position.y, selectedConnection.commandID) !== null
           
            setSelectedConnection({...selectedConnection, position: position, highlighted: overCommand})
       }
       else if(selectedItemID !== -1  && selecteItemType !== '')
       {            
            // Moving command

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
                
        if(programComponentToAdd.programComponentType==='command' || programComponentToAdd.programComponentType==='condition')
        {
            const action: IRoboshipsAddProgramComponentAction = { actionType: 'add-program-command', shipID: selectedShipID, component: programComponentToAdd, position: position }
            dispatch(action)        
        }
        else if(programComponentToAdd.programComponentType==='parameter')
        {
            let commandAndParam=mouseOverCommandOrParameter(position.x, position.y)

            if(commandAndParam.command !== null && commandAndParam.param !== null)
            {
                const action: IRoboshipsSetParameterAction = { actionType: 'set-program-parameter', shipID: selectedShipID, component: programComponentToAdd, setInCommand: commandAndParam.command, replaceParam: commandAndParam.param }
                dispatch(action)                    
            }
        }            
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
            // Connection moved - connect if over command

            let overCommand = mouseOverCommand(selectedConnection.position.x, selectedConnection.position.y, selectedConnection.commandID)

            if(overCommand !== null)
            {                
                const action: IRoboshipsConnectShipCommandAction = { actionType: 'connect-program-command', shipID: selectedShipID, commandID: selectedConnection.commandID, connectionIdx: selectedConnection.connectionIdx, connectToCommandID: overCommand.id }
                dispatch(action)
                                        
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
        x = Math.max(COMMAND_WIDTH/2, Math.min(x, scrollSizeX  - COMMAND_WIDTH/2));
        y = Math.max(COMMAND_HEIGHT/2, Math.min(y, scrollSizeY - COMMAND_HEIGHT/2));

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
            
        setProgramCommandMenu({show: false, commandId: -1, position: {x: 0, y: 0}})
    }

    function onExecuteSetConstParamValue(commandId: number, parameterId: number, value: number)
    {
        if(ship !== null)
        {
            const command = ship.program.find((command) => command.id === commandId)
            if(command !== undefined)
            {
                const parameter = command.parameters.find((parameter) => parameter.id === parameterId)
                if(parameter !== undefined)
                {
                    const action: IRoboshipsSetConstParameterAction = { actionType: 'set-const-parameter', shipID: selectedShipID, commandID: commandId, parameterID: parameterId, value: value }
                    dispatch(action)
                }
            }
        }

        setConstEdit({showConstEdit: false, commandId: -1, paramId: -1, position: {x: 0, y:0 }})
    }

    

    function openCommandContextMenu(commandId: number)
    {
        if(ship === null) return;        
        const command = ship.program.find((command) => command.id === commandId)
        if(command === undefined) return;            
        const position = {x: command.position.x * svgScale - svgScrollPos.x * svgScale, y: command.position.y * svgScale - svgScrollPos.y * svgScale}
        
        setProgramCommandMenu({show: true, commandId: commandId, position: position})
        
    }

    function openParamValueEdit(commandId: number, paramId: number)
    {        
        if(ship === null) return;        
        const command = ship.program.find((command) => command.id === commandId)
        if(command === undefined) return;            
        const parameter = command.parameters.find((parameter) => parameter.id === paramId)
        if(parameter === undefined) return;
     
        let paramPos=getParameterPosition(command,command.parameters.indexOf(parameter),true)
        const position = {x: paramPos.position.x * svgScale - svgScrollPos.x * svgScale, y: paramPos.position.y * svgScale - svgScrollPos.y * svgScale}


        setConstEdit({showConstEdit: true, commandId: commandId, paramId: paramId, position: position})
    }

    const constEditiInitialValue = useMemo(() => {        
        if(ship === null) return 0;        
        const command = ship.program.find((command) => command.id === constEdit.commandId)
        if(command === undefined) return 0;            
        const parameter = command.parameters.find((parameter) => parameter.id === constEdit.paramId)
        if(parameter === undefined) return 0;
        
        return (parameter as IProgramConstParameter).value
    }, [constEdit])

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
                <SVGGrid height={svgSize.height} width={svgSize.width} scale={svgScale} scrollPos={svgScrollPos} gridInterval={10} />
                {ship !== null && <SVGProgram ship={ship} scale={svgScale} scrollPos={svgScrollPos} 
                                               itemSelected={(itemType, itemId)=>{setSelectedItemType(itemType); setSelectedItemID(itemId) }}
                                               connectionSelected={(selectedConnection)=> setSelectedConnection(selectedConnection) }
                                               selectedConnection={selectedConnection}
                                               openContextMenu={ (commandId) => openCommandContextMenu(commandId)}
                                               openParamValueEdit={ (commandId, paramId) => openParamValueEdit(commandId, paramId) }                                                
                /> }

                <SVGScrollBars height={svgSize.height} width={svgSize.width} maxHeight={scrollSizeY} maxWidth={scrollSizeX} scale={svgScale} scrollPos={svgScrollPos} />
            </svg>
            {programCommandMenu.show && <ProgramCommandMenu menuTargetCommandId={programCommandMenu.commandId} 
                                                           onExecuteMenuCommand={ (target,command) => onExecuteMenuCommand(target, command)} 
                                                           position={programCommandMenu.position} 
                                                           closeMenu={() => setProgramCommandMenu({show: false, commandId: -1, position: {x: 0, y: 0}})} />}
            {constEdit.showConstEdit && <ConstValueEdit commandId={constEdit.commandId} parameterId={constEdit.paramId} 
                                                        initialValue={constEditiInitialValue} position={constEdit.position} 
                                                        setConstParamValue={ (commandId , parameterId , value) => onExecuteSetConstParamValue(commandId,parameterId,value) } /> }
        </div>      
    )
}