"use client"

import React, { useState, useContext } from 'react'
import LayoutEditor from './LayoutEditor'
import ProgramEditor from './ProgramEditor'
import ShipInfoEditor from './ShipInfoEditor';
import Image from 'next/image'


const tabs = ['Info', 'Layout', 'Program', 'Simulation'];

interface IShipEditorProps {
  selectedShipID: number
}

export default function ShipEditor( { selectedShipID }: IShipEditorProps) {

  const [activeTab, setActiveTab] = useState(2)  
  
  if (selectedShipID==-1) return (<div className='bg-base-200 flex flex-col flex-grow mr-1 my-1 rounded justify-center'>
    <div className="flex justify-center items-center h-full">
      <Image
        src="/Robot.png"
        width={896}
        height={512}
        alt="Roboships"
        priority
      />
    </div>
  </div>)

  return (

    <div className='bg-base-200 flex flex-col flex-grow mr-1 my-1 rounded'>

      <div className="tabs bg-slate-300 pt-1 rounded">

        {tabs.map((tab, index) => {
          return <a key={index} className={index == activeTab ? 'tab tab-active tab-bordered text-xl' : 'tab tab-bordered text-xl'} onClick={() => setActiveTab(index)}>{tab}</a>
        })}
      </div>

      {activeTab == 0 && <ShipInfoEditor selectedShipID={selectedShipID} />}
      {activeTab == 1 && <LayoutEditor selectedShipID={selectedShipID}  />}
      {activeTab == 2 && <ProgramEditor selectedShipID={selectedShipID} />}
      {activeTab == 3 && <div></div>}

    </div>

  )
}
