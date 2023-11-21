
interface ILayoutPaletteProps {
    onComponentDrag: (componentType: string) => void
}

export default function LayoutPalette( { onComponentDrag }: ILayoutPaletteProps) {

    function onDragStartList(e: React.DragEvent<HTMLLIElement>, componentType: string) {
         onComponentDrag(componentType);
    }

    return (
        <div className='bg-base-200 w-48 m-1 rounded flex flex-col'>
            <ul className='flex-grow m-1 rounded p-1 list-none basis-0 overflow-auto'>
                <li className='bg-gray-300 rounded m-1 p-1 cursor-pointer' draggable onDragStart={(e) => onDragStartList(e, "radar")}>
                    <p>Radar</p>
                </li>
                <li className='bg-gray-300 rounded m-1 p-1 cursor-pointer' draggable onDragStart={(e) => onDragStartList(e, "gun")}>
                    <p>Gun</p>
                </li>
            </ul>
        </div>
    )
}