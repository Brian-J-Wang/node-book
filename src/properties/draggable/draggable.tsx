import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Position } from "../../components/nodeviewer/nodeviewer"
import "./draggable.css"
import { DrawableContext } from "../drawable/drawable";

type DraggableProps = {
    id: string,
    className?: string,
    children?: ReactNode,
    detached?: boolean,
    invertDrag?: boolean,
    preventDefault?: boolean
    initialPosition?: Position
    passDragStart?: (position: Position) => void,
    passDrag?: (position: Position) => void
}

type ContextProps = {
    position: Position;
    suppressDrag: (suppress: boolean) => void;
}

const DraggableContext = createContext<ContextProps>({
    position: {x: 0, y: 0},
    suppressDrag: () => {}
});

const Draggable = ({className, children, detached, id, initialPosition, invertDrag, passDragStart, passDrag, preventDefault}: DraggableProps) => {
    const [position, setPosition] = useState<Position>(setInitialPosition);
    const dragStartPosition = useRef<Position>({x: 0, y: 0});
    const dragStartClientPosition = useRef<Position>(setInitialPosition());
    const parentPosition = useContext(DraggableContext);
    const drawingContext = useContext(DrawableContext);
    
    const [suppress, setSuppress] = useState<boolean>(false);

    function setInitialPosition() {
        return initialPosition ? initialPosition : {x: 0, y: 0};
    }

    function onDragStart(evt: React.DragEvent<HTMLInputElement>) {
        
        if (suppress) {
            return;
        }

        if (drawingContext.isDrawing) {
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

        if (passDragStart) {
            passDragStart(position);
        }

        
    }

    function onDrag(evt: React.DragEvent<HTMLInputElement>) {
        if (suppress) {
            return;
        }

        if (drawingContext.isDrawing) {
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
        
        if (passDrag) {
            passDrag(newPosition)
        }
    }

    function resetCursor(evt: React.DragEvent) {
        evt.preventDefault();

        document.body.style.cursor = 'default';
    }

    function handleSuppress(suppress: boolean) {
        setSuppress(suppress);
    }

    return (
        <DraggableContext.Provider value={{position, suppressDrag: handleSuppress}}>
            <div className={`${className} draggable`} onDragStart={onDragStart} onDrag={onDrag} onDragEnd={resetCursor} draggable={true} 
                style={!preventDefault ? {position: 'absolute', 
                    top: position.y + (!detached ? parentPosition.position.y : 0), 
                    left: position.x + (!detached ? parentPosition.position.x : 0)} : {}}
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