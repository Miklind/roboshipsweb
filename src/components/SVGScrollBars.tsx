interface IRenderGripProps {
    height: number
    width: number
    maxHeight: number
    maxWidth: number
    scale: number
    scrollPos: { x: number, y: number }
}

export default function SVGScrollBars({ height, width, maxWidth, maxHeight, scale, scrollPos }: IRenderGripProps) {

    function scaledToSVG(n: number): number {
        return n * scale;
    }

    if (scale === 0) return <></>;

    const visiblePartWidth = ((width / scale) / maxWidth);
    const relativePosWidth = scrollPos.x / maxWidth
    const barWidthWidth = width - 40;

    const visiblePartHeight = ((height / scale) / maxHeight);
    const relativePosHeight = scrollPos.y / maxHeight
    const barWidthHeight = height - 40;

    const bars = [];

    bars.push(
        <line key="topbarbg"

            x1={20}
            y1={10}
            x2={width - 20}
            y2={10}
            stroke="gray"
            strokeWidth="4"
        />
    );

    bars.push(
        <line key="topbarknob"

            x1={20 + relativePosWidth * barWidthWidth}
            y1={10}
            x2={20 + relativePosWidth * barWidthWidth + visiblePartWidth * barWidthWidth}
            y2={10}
            stroke="black"
            strokeWidth="6"
        />
    );

    bars.push(
        <line key="rightbarbg"

            x1={10}
            y1={20}
            x2={10}
            y2={height - 20}
            stroke="gray"
            strokeWidth="4"
        />
    );

    bars.push(
        <line key="rightbarknob"

            x1={10}
            y1={20 + relativePosHeight * barWidthHeight}
            x2={10}
            y2={20 + relativePosHeight * barWidthHeight + visiblePartHeight * barWidthHeight}
            stroke="black"
            strokeWidth="6"
        />
    );

    return (<>{bars}</>);
}