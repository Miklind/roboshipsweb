"use client"

import { IRoboshipsState, IRoboshipsStateAction } from "@/modules/shipstatecontext"
import { useContext, useState, useEffect } from "react"
import ShipStateContext from "@/modules/shipstatecontext"
import ShipListItem from "./ShipListItem"

interface IShipListProps {
    selectedShipID: number
    onShipSeleced: (shipID: number) => void  
    onLoadShip: () => void  
    onSaveShip: () => void
    
}

export default function ShipList( { selectedShipID, onShipSeleced, onLoadShip,onSaveShip }: IShipListProps) {

    const {state, dispatch} = useContext(ShipStateContext)
    const [shipAdded, setshipAdded] = useState(false)

    useEffect(() => {
        if (shipAdded) {
            if(state.ships.length === 0) return

            const newShip = state.ships[state.ships.length - 1]
            onShipSeleced(newShip.id)
            setshipAdded(false)
        }
    }, [shipAdded])

    function addShip() {
        const action: IRoboshipsStateAction = { actionType: 'add-ship' } 
        dispatch(action)
        setshipAdded(true)
    }
    
    return (
  
     <div className=' bg-base-200 w-48 m-1 rounded flex flex-col'>
        <div className='bg-slate-300 text-xl p-1 rounded'>Ships</div>
        <div className='btn-group btn-group-horizontal justify-center mt-2 mb-1'>
            <button className='btn btn-neutral btn-xs' onClick={ addShip }>New</button>
            <button className='btn btn-neutral btn-xs' onClick={ () => onLoadShip() }>Load</button>
            <button className='btn btn-neutral btn-xs' onClick={ () => onSaveShip() }>Save</button>
        </div>
        <ul className='flex-grow m-1 border-black border-2 rounded p-1 list-none'>
            { state.ships.map((ship) => {
                return <ShipListItem key={ship.id} shipID={ship.id} name={ship.name} selected={ ship.id === selectedShipID } onClick={  () => onShipSeleced(ship.id) } />
            }) }

        </ul>
     </div>
    
  )
}
