
interface ShipComponentMenuProps {    
    menuTargetComponentId: number
    onExecuteMenuCommand: (menuTargetComponentId: number, command: string ) => void
    position: {x: number, y: number}
    closeMenu: () => void
}

export default function ShipComponentMenu({ menuTargetComponentId, onExecuteMenuCommand,position, closeMenu }: ShipComponentMenuProps) {
    return (  
        <ul className="menu absolute bg-base-200 w-56 rounded-box"
            style={{             
            top: position.y, 
            left: position.x,
            transform: 'translate(-50%, -50%)'}}
            onMouseLeave={ () => closeMenu() }
        >
            <li><a onClick={() => onExecuteMenuCommand(menuTargetComponentId,"delete")}>Delete</a></li>
             
        </ul>
    )
  }