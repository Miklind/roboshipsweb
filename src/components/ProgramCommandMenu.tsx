

interface ProgramCommandMenuProps {    
    menuTargetCommandId: number
    onExecuteMenuCommand: (menuTargetCommandId: number, command: string ) => void
    position: {x: number, y: number}
    closeMenu: () => void
}

export default function ProgramCommandMenu({ menuTargetCommandId, onExecuteMenuCommand,position, closeMenu }: ProgramCommandMenuProps) {
    return (  
        <ul className="menu absolute bg-base-200 w-56 rounded-box"
            style={{             
            top: position.y, 
            left: position.x,
            transform: 'translate(-50%, -50%)'}}
            onMouseLeave={ () => closeMenu() }
        >
            <li><a onClick={() => onExecuteMenuCommand(menuTargetCommandId,"delete")}>Delete</a></li>
            <li><a onClick={() => onExecuteMenuCommand(menuTargetCommandId,"disconnect")}>Disconnect</a></li>            
        </ul>
    )
  }