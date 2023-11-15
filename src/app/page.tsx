"use client"

import React, { useReducer, useState, useEffect } from 'react'
import ShipList from '@/components/ShipList'
import ShipEditor from '@/components/ShipEditor'
import {shipStateReducer, IRoboshipsAddShipFromDataAction } from '@/modules/shipstatecontext'
import ShipStateContext from '@/modules/shipstatecontext'
import FileList from '@/components/FileList'
import { IShip } from '@/modules/roboships/ship'
import { setNextProgramCommandId, setNextProgramParameterId } from '@/modules/roboships/programcomponents'
import { setNextShipComponentId } from '@/modules/roboships/shipcomponent'





export default function Home() {

  const [state, dispatch] = useReducer(shipStateReducer, { ships:[] })  
  const [selectedShipId, setselectedShipId] = useState(-1)
  const [showLoadShip, setShowLoadShip] = useState(false)
  const [loadedShip, setLoadedShip] = useState<IShip | null>(null)
  const [fileMode, setFileMode] = useState('')

  useEffect(() => {
    if(loadedShip === null) return;

    const action: IRoboshipsAddShipFromDataAction = { actionType: 'add-ship-from-data', shipToAdd: loadedShip}
    dispatch(action)

  }, [loadedShip])

  function resetIdSequences(id: number)
  {
    if(id === -1) return;
    let ship= state.ships.find((ship) => ship.id === id)

    if(ship === undefined) return;

    let maxComponentId = ship.shipComponents.reduce((max, component) => Math.max(max, component.id), 0)
    let maxCommandId = ship.program.reduce((max, command) => Math.max(max, command.id), 0)
    let maxParamId = ship.program.reduce((max, command) => Math.max(max, command.parameters.reduce((max, param) => Math.max(max, param.id), 0)), 0)

    setNextProgramCommandId(maxCommandId+1)
    setNextProgramParameterId(maxParamId+1)
    setNextShipComponentId(maxComponentId+1)
  
  }
  

  function fileOperation(fileName: string)
  {
    if(fileMode === 'load')
    {
      fetch(`/api/files/${fileName}`)
      .then(response => response.json())
      .then(data =>setLoadedShip(data));
    }
    else if(fileMode === 'save')
    {
      const shipToSave: IShip | undefined = state.ships.find((ship) => ship.id === selectedShipId) 

      if(shipToSave !== undefined)
      {
        fetch(`/api/files/${fileName}`, {
          method: 'POST',
          body: JSON.stringify(shipToSave),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }



    
      
    }

    setShowLoadShip(false)
  }
  
  return (    
     <div className='flex bg-base-100 flex-grow'>
      <ShipStateContext.Provider value={ {state, dispatch} }>
        { !showLoadShip && <ShipList selectedShipID={selectedShipId} 
                                     onShipSeleced={ (id) => { setselectedShipId(id); resetIdSequences(id) }} 
                                     onLoadShip={() => { setFileMode('load'); setShowLoadShip(true) }}  
                                     onSaveShip={() => { setFileMode('save'); setShowLoadShip(true) }} /> }
        { !showLoadShip &&<ShipEditor selectedShipID={selectedShipId}/> }
        { showLoadShip && <FileList mode={fileMode} onClose={ () => setShowLoadShip(false) } onFileSelected={ (fileName) => fileOperation(fileName) } /> }
      </ShipStateContext.Provider>
     </div>    
  )
}
