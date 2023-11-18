import { createContext } from 'react'
import { IShip, createShip, getNewShipId } from "@/modules/roboships/ship"
import ShipComponentFactory from "./roboships/shipComponentFactory"
import ProgramCommandFactory  from "./roboships/programcommandfactory"
import { IPoint } from "./roboships/shapeutils"

interface IShipStateContext {
    state : IRoboshipsState;
    dispatch : React.Dispatch<any>;
}

const ShipStateContext = createContext<IShipStateContext>({} as IShipStateContext)


export interface IRoboshipsState {
    ships: IShip[]
  }
  
  export interface IProgramComponentToAdd {
    programComponentType: string
    programComponent: string
    programComponentTarget: string
  }
  
  export interface IRoboshipsStateAction {
    actionType: string
  }
  
  export interface IRoboshipsSetShipNameAction extends IRoboshipsStateAction {
    actionType: "set-ship-name"
    name: string
    shipID: number
  }
  
  export interface IRoboshipsAddShipComponentAction extends IRoboshipsStateAction {
    actionType: "add-ship-component"
    componentType: string
    position: IPoint
    shipID: number
  }
  
  export interface IRoboshipsMoveShipComponentAction extends IRoboshipsStateAction {
    actionType: "move-ship-component"
    shipID: number
    componentID: number
    position: IPoint
  }
  
  export interface IRoboshipsMoveShipCommandAction extends IRoboshipsStateAction {
    actionType: "move-program-command"
    shipID: number
    commandID: number
    position: IPoint
  }
  
  export interface IRoboshipsAddProgramComponentAction extends IRoboshipsStateAction {
    actionType: "add-program-component"
    component: IProgramComponentToAdd
    position: IPoint
    shipID: number
  }

  export interface IRoboshipsConnectShipCommandAction extends IRoboshipsStateAction {
    actionType: "connect-program-command"
    shipID: number
    commandID: number
    connectionIdx: number
    connectToCommandID: number
  }

  export interface IRoboshipsAddShipFromDataAction extends IRoboshipsStateAction {
    actionType: "add-ship-from-data"
    shipToAdd: IShip
  }

  export interface IRoboshipsDeleteShipCommandAction extends IRoboshipsStateAction {
      actionType: 'delete-program-command' 
      shipID: number 
      commandID: number
  }

       
  export interface IRoboshipsDisconnectShipCommandAction extends IRoboshipsStateAction { 
      actionType: 'disconnect-program-command'
      shipID: number
      commandID: number 
  }

    
  function GetCompomentSortValue(componentType: string): number {
    switch (componentType) {
      case 'hull':
        return 1
      case 'gun':
        return 2
      case 'radar':
        return 3
      default:
        return 0
    }
  }

  export function shipStateReducer(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    switch (action.actionType) {
      case "add-ship":
        return performAddShip(state, action);
  
      case "set-ship-name":
        return performSetShipName(state, action);
  
      case "add-ship-component":
        return performAddShipComponent(state, action);
  
      case "move-ship-component":
        return performMoveShipComponent(state, action);
  
      case "move-program-command":
        return performMoveProgramCommand(state, action);
  
      case "add-program-component":
        return performAddProgramComponent(state, action);
  
      case "connect-program-command":
        return performConnectProgramCommand(state, action);

      case "add-ship-from-data":
        return performAddShipFromData(state, action);

      case "delete-program-command":
        return performDeleteProgramCommand(state, action);

      case "disconnect-program-command":
        return performDisconnectProgramCommand(state, action);

      

      default:
        return state;
    }
  }

  function performDisconnectProgramCommand(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState
  {
    let disconnectShipCommandAction = action as IRoboshipsDisconnectShipCommandAction;
    let modifiedShips = state.ships.map((ship) => {

      if (ship.id === disconnectShipCommandAction.shipID) {
        let modifiedCommands = ship.program.map((command) => {

          if(command.connectedTo.find((connection) => connection === disconnectShipCommandAction.commandID))
          {
            let modifiedConnections = command.connectedTo.map((connection) => { 
              if(connection === disconnectShipCommandAction.commandID)
              {
                return -1
              }
              else
              {
                return connection
              }

            })
            return { ...command, connectedTo: modifiedConnections }
          }
          else
          {
            return command
          }

        })

        return { ...ship, program: modifiedCommands }
      }
      else {
        return ship
      }


    })
               
    return { ...state, ships: modifiedShips }
  }

  function performDeleteProgramCommand(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    let deleteShipCommandAction = action as IRoboshipsDeleteShipCommandAction;
    let modifiedShips = state.ships.map((ship) => {
      if (ship.id === deleteShipCommandAction.shipID) {
  
        let modifiedCommands = ship.program.filter((command) => {
  
          if (command.id === deleteShipCommandAction.commandID) {
            return false
          }
          else {
            return true
          }
        })
        return { ...ship, program: modifiedCommands }
      }
      else {
        return ship
      }
    });
    return { ...state, ships: modifiedShips }
    
  }

  function performConnectProgramCommand(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    let connectShipCommandAction = action as IRoboshipsConnectShipCommandAction;
    let modifiedShips = state.ships.map((ship) => {
      if (ship.id === connectShipCommandAction.shipID) {
  
        let modifiedCommands = ship.program.map((command) => {
  
          if (command.id === connectShipCommandAction.commandID) {
            let modifiedConnections = command.connectedTo.map((connection, idx) => {
              if (idx === connectShipCommandAction.connectionIdx) {
                return connectShipCommandAction.connectToCommandID
              }
              else {
                return connection
              }
            })
            return { ...command, connectedTo: modifiedConnections }
          }
          else {
            return command
          }
        })
        return { ...ship, program: modifiedCommands }
      }
      else {
        return ship
      }
    });
    return { ...state, ships: modifiedShips }
    
  }
  
  function performMoveProgramCommand(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    let moveShipCommandAction = action as IRoboshipsMoveShipCommandAction;
    let modifiedShips = state.ships.map((ship) => {
      if (ship.id === moveShipCommandAction.shipID) {
  
        let modifiedCommands = ship.program.map((command) => {
  
          if (command.id === moveShipCommandAction.commandID) {
            return { ...command, position: moveShipCommandAction.position }
          }
          else {
            return command
          }
        })
        return { ...ship, program: modifiedCommands }
      }
      else {
        return ship
      }
    });
    return { ...state, ships: modifiedShips }
  }
  
  function performAddShip(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    if (state.ships.length < 8) {
      let newShip = createShip()
      let hull = ShipComponentFactory.createHull()
      hull.position = { x: 35, y: 50 }
      newShip.shipComponents.push(hull);
  
      let startCommand = ProgramCommandFactory.createProgramCommand("Start","general",-1)
      startCommand.position = { x: 20, y: 20 }
      newShip.program.push(startCommand)
  
  
      return { ...state, ships: [...state.ships, newShip] }
    }
  
    return state;
  }

  function performAddShipFromData(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    if (state.ships.length < 8) {
      let addShipFromDataAction = action as IRoboshipsAddShipFromDataAction;

      let newShip = {...addShipFromDataAction.shipToAdd, id: getNewShipId()}


      return { ...state, ships: [...state.ships, newShip] }
    }

    return state;
  
  }
  
  function performSetShipName(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    let setShipNameAction = action as IRoboshipsSetShipNameAction;
    let modifiedShips = state.ships.map((ship) => {
      if (ship.id === setShipNameAction.shipID) {
        return { ...ship, name: setShipNameAction.name }
      }
      else {
        return ship
      }
    });
    return { ...state, ships: modifiedShips }
  }
  
  function performAddShipComponent(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    let addShipComponentAction = action as IRoboshipsAddShipComponentAction;
    let modifiedShips = state.ships.map((ship) => {
      if (ship.id === addShipComponentAction.shipID) {
        let newCompomnent = ShipComponentFactory.createShipComponent(addShipComponentAction.componentType)
        newCompomnent.position = addShipComponentAction.position
  
        let newCompomnents = [...ship.shipComponents, newCompomnent]
        newCompomnents.sort((a, b) => GetCompomentSortValue(a.componentType) - GetCompomentSortValue(b.componentType))
  
        return { ...ship, shipComponents: newCompomnents }
      }
      else {
        return ship
      }
    });
    return { ...state, ships: modifiedShips }
  }
  
  function performMoveShipComponent(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    let moveShipComponentAction = action as IRoboshipsMoveShipComponentAction;
    let modifiedShips = state.ships.map((ship) => {
      if (ship.id === moveShipComponentAction.shipID) {
  
        let modifiedComponents = ship.shipComponents.map((component) => {
  
          if (component.id === moveShipComponentAction.componentID) {
            return { ...component, position: moveShipComponentAction.position }
          }
          else {
            return component
          }
        })
        return { ...ship, shipComponents: modifiedComponents }
      }
      else {
        return ship
      }
    });
    return { ...state, ships: modifiedShips }
  }
  
  function performAddProgramComponent(state: IRoboshipsState, action: IRoboshipsStateAction): IRoboshipsState {
    
      
    let addProgramComponentAction = action as IRoboshipsAddProgramComponentAction;
  
    let modifiedShips = state.ships.map((ship) => {
      if (ship.id === addProgramComponentAction.shipID) {
        if(addProgramComponentAction.component.programComponentType === "command")
        {        
          let newProgramComponent = ProgramCommandFactory.createProgramCommand(addProgramComponentAction.component.programComponent, addProgramComponentAction.component.programComponentTarget, -1)
          newProgramComponent.position = addProgramComponentAction.position
  
          let newProgramComponents = [...ship.program, newProgramComponent]
  
          return { ...ship, program: newProgramComponents }
        }
        else
        {
          return ship
        } 
      }
      else {
        return ship
      }
    });
    return { ...state, ships: modifiedShips }
  }
 
   



export default ShipStateContext