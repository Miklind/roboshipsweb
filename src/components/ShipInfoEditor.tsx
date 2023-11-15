"use client"

import { IRoboshipsSetShipNameAction } from "@/modules/shipstatecontext"
import { useContext } from "react"
import ShipStateContext from "@/modules/shipstatecontext"
import { IShip } from "@/modules/roboships/ship"


interface IShipInfoEditorProps {
  selectedShipID: number
}

export default function ShipInfoEditor( { selectedShipID } : IShipInfoEditorProps ) {

  const {state, dispatch} = useContext(ShipStateContext)     

  
  function setShipName(event: React.ChangeEvent<HTMLInputElement>) {
    const action: IRoboshipsSetShipNameAction = { actionType: 'set-ship-name', shipID: selectedShipID, name: event.target.value }
    dispatch(action)
  }

  const ship: IShip | null = state.ships.find((ship) => ship.id === selectedShipID)  || null

  return (

    <div className='bg-base-300 rounded px-2 mt-1 flex flex-col flex-grow'>

      <label className="input-group my-2">
        <span className='w-24'>Name</span>
        <input type="text" placeholder="" className="input input-bordered input-sm" value={ship?.name ?? ''} onChange={ setShipName } />
      </label>

      <label className="input-group my-2">
        <span className='w-24'>Author</span>
        <input type="text" placeholder="" className="input input-bordered input-sm"   />
      </label>

      <div className='flex flex-grow my-2'>
        <label className="input-group input-group-vertical">
          <span>Description</span>
          <textarea className="flex-grow textarea textarea-bordered resize-none" placeholder="" ></textarea>
        </label>
      </div>

    </div>

  )
}
