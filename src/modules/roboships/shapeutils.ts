import { IProgramCommand, IProgramParameter } from "./programcomponents";

export const commandWidth: number = 32
export const commandHeight: number = 8
export const commmandTitleHeight: number = 3


export interface IPoint {
  x: number;
  y: number;
}

export interface IRectPosition
{
  position: IPoint
  width: number
  height: number
  
}

export function getParameterPosition(command: IProgramCommand, parameterIdx: number, centered: boolean) : IRectPosition
{


  const paramWidth: number = command.parameters.length > 1 ? commandWidth / command.parameters.length : commandWidth
  const paramHeight: number = commandHeight - commmandTitleHeight
  const paramX=  command.position.x - commandWidth / 2 + parameterIdx * paramWidth + (centered ? paramWidth / 2 : 0)
  const paramY=  command.position.y - commandHeight / 2 + commmandTitleHeight + (centered ? paramHeight / 2 : 0)

  return { position: { x: paramX, y: paramY }, width: paramWidth, height: paramHeight } 
}

export function isPointInsidePolygon(point: IPoint, shape: IPoint[], shapePos: IPoint) : boolean  
{
    const x = point.x
    const y = point.y
    
    let inside = false
    for (let i = 0, j = shape.length - 1; i < shape.length; j = i++) {
      const xi = shape[i].x + shapePos.x
      const yi = shape[i].y + shapePos.y
      const xj = shape[j].x + shapePos.x
      const yj = shape[j].y + shapePos.y
    
      const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    
    return inside
}

export function isPointInsideRect(point: IPoint, rectCenter: IPoint, rectWidth:number, rectHeight: number) : boolean
{    
    const halfWidth = rectWidth / 2
    const halfHeight = rectHeight / 2
    
    return point.x >= rectCenter.x - halfWidth && point.x <= rectCenter.x + halfWidth && point.y >= rectCenter.y - halfHeight && point.y <= rectCenter.y + halfHeight
}

export function calculateCenterArrowPoints(from: IPoint, to: IPoint ) : IPoint[]
{
  let result: IPoint[] = []

  const xdiff = to.x - from.x;
  const ydiff = to.y - from.y;

  const lenght = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
  const xNorm = xdiff / lenght;
  const yNorm = ydiff / lenght;

  const sideWaysX = yNorm;
  const sideWaysY = -xNorm

  const arrowEndCenterX = from.x + xNorm * (lenght / 2 - 1.5);
  const arrowEndCenterY = from.y + yNorm * (lenght / 2 - 1.5);

  const arrowStartCenterX = from.x + xNorm * (lenght / 2 + 1.5);
  const arrowStartCenterY = from.y + yNorm * (lenght / 2 + 1.5);

  result.push({ x: arrowStartCenterX, y: arrowStartCenterY })
  result.push({ x: arrowEndCenterX + sideWaysX * 2, y: arrowEndCenterY + sideWaysY * 2 })  
  result.push({ x: arrowEndCenterX - sideWaysX * 2, y: arrowEndCenterY - sideWaysY * 2 })

  return result
}