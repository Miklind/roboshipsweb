import { createContext } from 'react'
import { IShip, createShip, getNewShipId } from "@/modules/roboships/ship"
import ShipComponentFactory from "./roboships/shipComponentFactory"
import ProgramCommandFactory from "./roboships/programcommandfactory"
import ProgramParameterFactory from './roboships/programparameterFactory'
import { IPoint } from "./roboships/shapeutils"
import { IProgramCommand, IProgramParameter } from './roboships/programcomponents'

interface IShipStateContext {
  state: IRoboshipsState;
  dispatch: React.Dispatch<any>;
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

export interface IRoboshipsAction {
  actionType: string
}

export interface IRoboshipsStringAction extends IRoboshipsAction {
  shipID: number
  value: string  
}

export interface IRoboshipsAddShipComponentAction extends IRoboshipsAction {
  actionType: "add-ship-component"
  componentType: string
  position: IPoint
  shipID: number
}

export interface IRoboshipsAddProgramComponentAction extends IRoboshipsAction {
  actionType: "add-program-command"
  component: IProgramComponentToAdd
  position: IPoint
  shipID: number
}

export interface IRoboshipsPositionAction extends IRoboshipsAction {
  shipID: number
  targetID: number
  position: IPoint
}

export interface IRoboshipsConnectShipCommandAction extends IRoboshipsAction {
  actionType: "connect-program-command"
  shipID: number
  commandID: number
  connectionIdx: number
  connectToCommandID: number
}

export interface IRoboshipsAddShipFromDataAction extends IRoboshipsAction {
  actionType: "add-ship-from-data"
  shipToAdd: IShip
}

export interface IRoboshipsNumberAction extends IRoboshipsAction {  
  shipID: number
  value: number
}

export interface IRoboshipsSetParameterAction extends IRoboshipsAction {
  actionType: 'set-program-parameter'
  shipID: number
  component: IProgramComponentToAdd
  setInCommand: IProgramCommand
  replaceParam: IProgramParameter
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

export function shipStateReducer(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  switch (action.actionType) {
    case "add-ship":
      return performAddShip(state, action);

    case "set-ship-name":
      return performSetShipName(state, action);

    case "set-ship-author":
      return performSetShipAuthor(state, action);

    case "set-ship-description":
      return performSetShipDescription(state, action);

    case "add-ship-component":
      return performAddShipComponent(state, action);

    case "move-ship-component":
      return performMoveShipComponent(state, action);

    case "move-program-command":
      return performMoveProgramCommand(state, action);

    case "add-program-command":
      return performAddProgramCommand(state, action);

    case "connect-program-command":
      return performConnectProgramCommand(state, action);

    case "add-ship-from-data":
      return performAddShipFromData(state, action);

    case "delete-program-command":
      return performDeleteProgramCommand(state, action);

    case "disconnect-program-command":
      return performDisconnectProgramCommand(state, action);

    case "delete-ship-component":
      return performDeleteShipComponent(state, action);

    case "set-program-parameter":
      return performSetProgramParameter(state, action);

    default:
      return state;
  }
}

function performSetProgramParameter(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let setProgramParameterAction = action as IRoboshipsSetParameterAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === setProgramParameterAction.shipID) {

      let modifiedProgram = ship.program.map((command) => {
        if (command.id === setProgramParameterAction.setInCommand.id) {
          let modifiedParameters = command.parameters.map((parameter) => {
            if (parameter.id === setProgramParameterAction.replaceParam.id) {
              return ProgramParameterFactory.createProgramParameter(setProgramParameterAction.component.programComponent, setProgramParameterAction.component.programComponentTarget, -1)
            }
            else {
              return parameter
            }
          })
          return { ...command, parameters: modifiedParameters }
        }
        else {
          return command
        }
      })
      return { ...ship, program: modifiedProgram }
    }
    else {
      return ship
    }
  });
  return { ...state, ships: modifiedShips }
}

function performDeleteShipComponent(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let deleteShipComponentAction = action as IRoboshipsNumberAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === deleteShipComponentAction.shipID) {

      let modifiedComponents = ship.shipComponents.filter((component) => {

        if (component.id === deleteShipComponentAction.value) {
          return false
        }
        else {
          return true
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

function performDisconnectProgramCommand(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let disconnectShipCommandAction = action as IRoboshipsNumberAction;
  let modifiedShips = state.ships.map((ship) => {

    if (ship.id === disconnectShipCommandAction.shipID) {
      let modifiedCommands = ship.program.map((command) => {

        if (command.connectedTo.find((connection) => connection === disconnectShipCommandAction.value)) {
          let modifiedConnections = command.connectedTo.map((connection) => {
            if (connection === disconnectShipCommandAction.value) {
              return -1
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
  })

  return { ...state, ships: modifiedShips }
}

function performDeleteProgramCommand(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let deleteShipCommandAction = action as IRoboshipsNumberAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === deleteShipCommandAction.shipID) {

      let modifiedCommands = ship.program.filter((command) => {

        if (command.id === deleteShipCommandAction.value) {
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

  // Remove connection to deleted command
  
  modifiedShips = modifiedShips.map((ship) => {
    if (ship.id === deleteShipCommandAction.shipID) {
      let modifiedCommands = ship.program.map((command) => {
        let modifiedConnections = command.connectedTo.map((connection) => {
          if (connection === deleteShipCommandAction.value) {
            return -1
          }
          else {
            return connection
          }
        })
        return { ...command, connectedTo: modifiedConnections }
      })
      return { ...ship, program: modifiedCommands }
    }
    else {
      return ship
    }
  })

  return { ...state, ships: modifiedShips }
}

function performConnectProgramCommand(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
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

function performMoveProgramCommand(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let moveShipCommandAction = action as IRoboshipsPositionAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === moveShipCommandAction.shipID) {

      let modifiedCommands = ship.program.map((command) => {

        if (command.id === moveShipCommandAction.targetID) {
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

function performAddShip(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  if (state.ships.length < 8) {
    let newShip = createShip()
    let hull = ShipComponentFactory.createHull()
    hull.position = { x: 35, y: 50 }
    newShip.shipComponents.push(hull);

    let startCommand = ProgramCommandFactory.createProgramCommand("Start", "General", -1)
    startCommand.position = { x: 20, y: 20 }
    newShip.program.push(startCommand)

    return { ...state, ships: [...state.ships, newShip] }
  }

  return state;
}

function performAddShipFromData(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  if (state.ships.length < 8) {
    let addShipFromDataAction = action as IRoboshipsAddShipFromDataAction;

    let newShip = { ...addShipFromDataAction.shipToAdd, id: getNewShipId() }

    return { ...state, ships: [...state.ships, newShip] }
  }

  return state;
}

function performSetShipName(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let setShipNameAction = action as IRoboshipsStringAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === setShipNameAction.shipID) {
      return { ...ship, name: setShipNameAction.value }
    }
    else {
      return ship
    }
  });
  return { ...state, ships: modifiedShips }
}

function performSetShipAuthor(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let setShipAuthorAction = action as IRoboshipsStringAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === setShipAuthorAction.shipID) {
      return { ...ship, author: setShipAuthorAction.value }
    }
    else {
      return ship
    }
  });
  return { ...state, ships: modifiedShips }
}

function performSetShipDescription(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
     
  let setShipDescriptionAction = action as IRoboshipsStringAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === setShipDescriptionAction.shipID) {
      return { ...ship, description: setShipDescriptionAction.value }
    }
    else {
      return ship
    }
  });
  return { ...state, ships: modifiedShips }
}

function performAddShipComponent(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
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

function performMoveShipComponent(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let moveShipComponentAction = action as IRoboshipsPositionAction;
  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === moveShipComponentAction.shipID) {

      let modifiedComponents = ship.shipComponents.map((component) => {

        if (component.id === moveShipComponentAction.targetID) {
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

function performAddProgramCommand(state: IRoboshipsState, action: IRoboshipsAction): IRoboshipsState {
  let addProgramComponentAction = action as IRoboshipsAddProgramComponentAction;

  let modifiedShips = state.ships.map((ship) => {
    if (ship.id === addProgramComponentAction.shipID) {
  
        let newProgramComponent = ProgramCommandFactory.createProgramCommand(addProgramComponentAction.component.programComponent, addProgramComponentAction.component.programComponentTarget, -1)
        newProgramComponent.position = addProgramComponentAction.position

        let modifiedProgram = [...ship.program, newProgramComponent]

        return { ...ship, program: modifiedProgram }
      
    }
    else {
      return ship
    }
  });
  return { ...state, ships: modifiedShips }
}


export default ShipStateContext