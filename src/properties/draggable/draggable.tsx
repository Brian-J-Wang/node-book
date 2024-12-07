import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Position } from "../../utils/math/position";
import "./draggable.css"
import { GlobalDragContext } from "./globalDragController";

type DraggableProps = {
    id: string,
    className?: string,
    children?: ReactNode,
    detached?: boolean,
    invertDrag?: boolean,
    preventDefault?: boolean,
    offset?: Position;
    initialPosition?: Position,
    onDragStart?: (position: Position) => void,
    onDrag?: (position: Position) => void,
    onDragEnd?: (position: Position) => void,
    
}

type ContextProps = {
    position: Position;
    suppressDrag: (suppress: boolean) => void;
}

const DraggableContext = createContext<ContextProps>({
    position: {x: 0, y: 0},
    suppressDrag: () => {}
});

const Draggable = ({className, children, detached, id, offset, initialPosition, invertDrag, onDragStart, onDrag, onDragEnd, preventDefault}: DraggableProps) => {
    const [position, setPosition] = useState<Position>(setInitialPosition);
    const dragStartPosition = useRef<Position>({x: 0, y: 0});
    const dragStartClientPosition = useRef<Position>(setInitialPosition());
    const parentPosition = useContext(DraggableContext);
    const dragControllerContext = useContext(GlobalDragContext);

    
    const [suppress, setSuppress] = useState<boolean>(false);

    function setInitialPosition() {
        return initialPosition ? initialPosition : {x: 0, y: 0};
    }

    function handleDragStart(evt: React.DragEvent<HTMLDivElement>) {
        if (suppress || dragControllerContext.isSuppress) {
            evt.preventDefault();
            return;
        }

        evt.dataTransfer.setDragImage(new Image(), 0, 0);
        evt.dataTransfer.effectAllowed = "move";

        dragStartPosition.current = position;

        dragStartClientPosition.current = {
            x: evt.clientX,
            y: evt.clientY
        }

        if (onDragStart) {
            onDragStart(position);
        }        
    }

    function handleDrag(evt: React.DragEvent<HTMLDivElement>) {
        if (suppress || dragControllerContext.isSuppress) {
            evt.preventDefault();
            return;
        }

        //@ts-ignore
        if (evt.target.id != id) {
            return;
        }

        if (!evt.clientX || !evt.clientY) {
            return;
        }

        const newPosition = invertDrag ? {
            x: (dragStartClientPosition.current.x - evt.clientX),
            y: (dragStartClientPosition.current.y - evt.clientY)
        }
        : {
            x: (evt.clientX - dragStartClientPosition.current.x),
            y: (evt.clientY - dragStartClientPosition.current.y)
        }

        newPosition.x += dragStartPosition.current.x;
        newPosition.y += dragStartPosition.current.y;

        setPosition({
            x: newPosition.x,
            y: newPosition.y
        });
        
        if (onDrag) {
            onDrag(newPosition)
        }
    }

    function handleDragEnd(evt: React.DragEvent<HTMLDivElement>) {
        resetCursor(evt);

        //@ts-ignore
        const rect = evt.target.getBoundingClientRect();

        if (onDragEnd) {
            onDragEnd({
                x: rect.x,
                y: rect.y
            })
        }
    }

    function resetCursor(evt: React.DragEvent) {
        evt.preventDefault();

        document.body.style.cursor = 'default';
    }

    return (
        <DraggableContext.Provider value={{position, suppressDrag: setSuppress}}>
            <div className={`${className} draggable`} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd} draggable={true} 
                style={!preventDefault ? { 
                    top: position.y + (!detached ? parentPosition.position.y : 0) + (offset?.x ?? 0), 
                    left: position.x + (!detached ? parentPosition.position.x : 0) + (offset?.y ?? 0)} : {}}
                id={id}>
                    {children}
            </div>
        </DraggableContext.Provider>
        
    )
}

type PreventDragProps = {
    children: ReactNode
    hidden: boolean
}

const PreventDrag = ({children, hidden}: PreventDragProps) => {
    const ParentDraggableContext = useContext(DraggableContext);

    function onMouseDown() {
        ParentDraggableContext.suppressDrag(true);

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("dragend", handleMouseUp);
    }

    function handleMouseUp() {
        ParentDraggableContext.suppressDrag(false);

        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("dragend", handleMouseUp);
    }

    return (
        <div onMouseDown={onMouseDown} hidden={hidden} style={{height: '100%'}}>
            {children}
        </div>
    )
}

Draggable.Prevent = PreventDrag;

export default Draggable