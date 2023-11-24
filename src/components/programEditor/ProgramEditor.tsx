"use client"

import React, { useState, useRef, useEffect, useContext } from 'react'
import ProgramEditorSVG from './ProgramEditorSVG';
import ProgramPalette from './ProgramPalette';

interface IProgramEditorProps {
  selectedShipID: number
}

export default function ProgramEditor({ selectedShipID }: IProgramEditorProps) {

  const [programComponentToAdd, setProgramComponentToAdd] = useState({programComponentType: '', programComponent: '', programComponentTarget: ''})
  
  
  return (
    <div className='flex flex-row flex-grow'>
      <ProgramPalette onComponentDrag={(programComponentType, programComponent, programComponentTarget) => setProgramComponentToAdd({programComponentType: programComponentType, programComponent: programComponent, programComponentTarget: programComponentTarget})  } />                   
      <ProgramEditorSVG selectedShipID={selectedShipID} programComponentToAdd={programComponentToAdd} />
    </div>
  )
}
