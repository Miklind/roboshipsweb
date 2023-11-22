import { IShip } from "@/modules/roboships/ship";
import SVGProgramCommand from "./SVGProgramCommand";
import SVGProgramCommandConnection from "./SVGProgramCommandConnection";
import { ISelectedConnection } from "./SVGProgramCommandConnection";
import { IPoint } from "@/modules/roboships/shapeutils";

interface ISVGProgramProps {
    scale: number  
    ship: IShip 
    scrollPos: IPoint
    itemSelected: (itemType: string, itemID: number) => void
    connectionSelected: (connection : ISelectedConnection) => void
    selectedConnection: ISelectedConnection | null
    openContextMenu: (commandId: number) => void
    openParamValueEdit: (commandId: number, paramId: number) => void
}

export default function SVGProgram({ scale, ship, scrollPos, itemSelected, connectionSelected, selectedConnection, openContextMenu, openParamValueEdit } : ISVGProgramProps ) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    return (<>

        {ship.program.map((command => {     
            return <SVGProgramCommandConnection key={`connection${command.id}}`} ship={ship} scale={scale} scrollPos={scrollPos} command={command} connectionSelected={connectionSelected} selectedConnection={selectedConnection} />    
        }))}

        {ship.program.map((command => {     
            return <SVGProgramCommand key={`command${command.id}}`} scale={scale} scrollPos={scrollPos} command={command} itemSelected={(type,id) => itemSelected(type,id)} 
                                      openContextMenu={ (commandId) => openContextMenu(commandId)}
                                      openParamValueEdit={ (commandId, paramId) => openParamValueEdit(commandId, paramId)} />    
        }))}
    
    </>);
}