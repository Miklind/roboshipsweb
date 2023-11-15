"use client"

import React, { useState } from 'react'

interface IShipListProps {
    fileName: string
    selected: boolean    
    onClick: (fileName: string) => void
    onDblClick: (fileName: string) => void
}

export default function FileListItem( {fileName, selected, onClick, onDblClick}: IShipListProps) {


  return (
  
     <li className={ selected ? "bg-green-400 rounded px-2 mt-1 cursor-pointer" : "bg-base-200 rounded px-2 mt-1 cursor-pointer" } onDoubleClick={ () => onDblClick(fileName)} onClick={ () => onClick(fileName)}>
       <p> { fileName }</p> 
     </li>
    
  )
}
  
