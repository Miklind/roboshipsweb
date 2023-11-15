export interface IPoint {
  x: number;
  y: number;
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
