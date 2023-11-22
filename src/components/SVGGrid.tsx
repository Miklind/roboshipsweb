import { IPoint } from "@/modules/roboships/shapeutils"

interface IRenderGridProps 
{ 
    height: number
    width: number
    scale: number
    scrollPos: IPoint
    gridInterval: number
}

export default function SVGGrid({ height, width, scale, scrollPos, gridInterval} : IRenderGridProps ) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    if (scale === 0) return <></>;

    const xSize = width / scale;
    const ySize = height / scale;

    const grid = [];
  

    const placementX = scrollPos.x%gridInterval
    const placementY = scrollPos.y%gridInterval

    for (let x = 0; x <= xSize + gridInterval; x += gridInterval) {
        grid.push(
            <line
                key={`linex${x}`}
                x1={scaledToSVG(x-placementX)}
                y1={0}
                x2={scaledToSVG(x-placementX)}
                y2={scaledToSVG(ySize)}
                stroke="blue"
                strokeWidth="1"
            />
        );
    }

    for (let y = 0; y <= ySize + gridInterval; y += gridInterval) {
        grid.push(
            <line
                key={`liney${y}`}
                x1={0}
                y1={scaledToSVG(y-placementY)}
                x2={scaledToSVG(xSize)}
                y2={scaledToSVG(y-placementY)}
                stroke="blue"
                strokeWidth="1"
            />
        );
    }

    return (<>{grid}</>);
}