"use client"

import React, { useState } from 'react'

interface IShipListProps {
    name: string
    selected: boolean
    shipID: number
    onClick: (shipID: number) => void
}

export default function ShipListItem( {name, selected, shipID, onClick}: IShipListProps) {


  return (
  
     <li className={ selected ? "bg-green-400 rounded px-2 mt-1 cursor-pointer" : "bg-base-200 rounded px-2 mt-1 cursor-pointer" } onClick={ () => onClick(shipID)}>
       <p> { name }</p> 
     </li>
    
  )
}
  
