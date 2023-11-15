import { useEffect, useState } from "react"
import FileListItem from "./FileListItem";

interface IFileListProps {
    mode: string
    onClose: () => void
    onFileSelected: (fileName: string) => void
}

export default function FileList({ mode, onClose, onFileSelected }: IFileListProps) {
    
    const [shipFiles, setShipFiles] = useState<string[]>([])
    const [selectedShipFile, setSelectedShipFile] = useState('')
        
    useEffect(() => {
        fetch('/api/files')
        .then(response => response.json())
        .then(data => setShipFiles(data));

        if(mode==='save') setSelectedShipFile('untitled.txt')
    }, []);

    function fileNameEdited(event: React.ChangeEvent<HTMLInputElement>) 
    {
        setSelectedShipFile(event.target.value)
    }

    return (  
       <div className='bg-base-300 px-3 flex-grow flex flex-col'>
        <h1 className="text-xl m-4">{ mode==='save' ? 'Select save filename' : 'Select ship to load:' }</h1>
            <ul className='flex-grow m-1 border-black border-2 rounded p-1 list-none'>
            { shipFiles.map((ship) => {
                if(mode === 'save')  return <FileListItem key={ship} fileName={ship} selected={ ship === selectedShipFile }  onClick={  (fileName) => { setSelectedShipFile(fileName)  } } onDblClick={ (fileName) => { setSelectedShipFile(fileName) } } />
                else return <FileListItem key={ship} fileName={ship} selected={ ship === selectedShipFile }  onClick={  (fileName) => { setSelectedShipFile(fileName)  } } onDblClick={ (fileName) => { onFileSelected(fileName) } } />
            })}                    
        </ul>

        {   mode !== 'save' &&
            <div className="flex flex-row mb-5 mt-2">
                <button className="btn btn-primary flex-grow m-1" disabled={selectedShipFile===''} onClick={() => onFileSelected(selectedShipFile)} >Load</button>
                <button className="btn btn-secondary m-1" onClick={() => onClose()}>Close</button>
            </div>
        }

        {   mode === 'save' &&
            <div className="flex flex-col mb-5 mt-2">
                <input className="input input-bordered w-full m-1" type="text" value={selectedShipFile} onChange={fileNameEdited}/>
                <div className="flex flex-row mb-5 mt-2">
                    <button className="btn btn-primary flex-grow m-1" disabled={selectedShipFile===''} onClick={() => onFileSelected(selectedShipFile)} >Save</button>
                    <button className="btn btn-secondary m-1" onClick={() => onClose()}>Close</button>
                </div>
            </div>
        }

       </div>    
    )
  }