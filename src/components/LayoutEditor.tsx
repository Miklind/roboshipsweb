"use client"

import React, { useState } from 'react'
import LayoutEditorSVG from './LayoutEditorSVG';
import LayoutPalette from './LayoutPalette';

interface ILayoutEditorProps {
  selectedShipID: number
}

export default function LayoutEditor({ selectedShipID }: ILayoutEditorProps) {

  const [componentTypeToAdd, setComponentTypeToAdd] = useState('')
  
  return (
    <div className='flex flex-row flex-grow'>

      <LayoutPalette onComponentDrag={(componentType) => setComponentTypeToAdd(componentType)} />
      <LayoutEditorSVG selectedShipID={selectedShipID} componentTypeToAdd={componentTypeToAdd} />
    </div>
  )
}
