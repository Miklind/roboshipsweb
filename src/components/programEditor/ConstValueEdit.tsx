import { IPoint } from "@/modules/roboships/shapeutils"
import { useState, useRef } from "react"

interface IConstValueEditProps {
   commandId: number
   parameterId: number
   initialValue: number
   position: IPoint

   setConstParamValue: (commandId: number , parameterId: number , value: number) => void
}

export default function ConstValueEdit({ commandId, parameterId, initialValue, setConstParamValue, position }: IConstValueEditProps) {

   const [inputtValue, setInputValue] = useState(initialValue)
   const inputRef = useRef<HTMLInputElement>(null);

   return (
      <div className='bg-base-300 absolute p-1 border-2 border-black rounded'
         style={{
            top: position.y,
            left: position.x,
            transform: 'translate(-50%, -50%)'
         }} >

         <label className="input-group m-1">
            <span >Value</span>
            <input  ref={inputRef} type="text" placeholder="" className="input input-bordered input-sm" value={inputtValue}
             onChange={(e) => { let newValue=parseFloat(e.target.value);  setInputValue(!Number.isNaN(newValue) ? newValue : 0) }}
             onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.blur() }}
             onBlur={(e) => { setConstParamValue(commandId, parameterId, parseFloat(e.target.value)) } }
             autoFocus
            />
         </label>
      </div>
   )
}