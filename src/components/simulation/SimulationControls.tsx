
interface SimulationControlsProps {
  simtime: number
  onPlay: () => void
  onStop: () => void
  onPause: () => void
}

export default function SimulationControls({ onPlay, onStop, onPause, simtime} : SimulationControlsProps) {
  return (      
         <div className='btn-group btn-group-horizontal mt-1 ml-5 mb-1'>
            <button className='btn btn-neutral btn-xs' onClick={() => onPlay()}>Play</button>
            <button className='btn btn-neutral btn-xs' onClick={() => onPause()}>Pause</button>
            <button className='btn btn-neutral btn-xs' onClick={() => onStop()}>Stop</button>
            <div className="bg-slate-500 px-4 mx-1 rounded text-white">{simtime.toFixed(1)} s</div>
        </div>      
  )
}
