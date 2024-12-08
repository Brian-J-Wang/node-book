import { forwardRef, ReactNode, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Position } from "../../utils/math/position";

type BoundingBoxProps = {
    children: ReactNode,
    onBound?: (evt: MouseEvent) => void,
    onOutOfBound?: (evt: MouseEvent) => void,
}

export type OutofBoundsHandle = {
    setListen: (value: boolean) => void;
}

const BoundingBox = forwardRef<OutofBoundsHandle, BoundingBoxProps>(({children, onBound, onOutOfBound}, ref) => {
    const [ listen, setListen ] = useState<boolean>(false);
    const boundingElement = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;

    useImperativeHandle(ref, () => ({
        setListen: (value) => {
            setListen(value);
        }
    }));

    //cleans up event listeners in case this component gets unmounted.
    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown);
        
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        }
    }, [listen])

    function handleMouseDown(evt: MouseEvent) {
        if (!listen || evt.button != 0) {
            return;
        }

        const clientRect = getBounds();

        if (clientRect && withinBounds(clientRect, {
            x: evt.clientX,
            y: evt.clientY
        })) {
            onBound && onBound(evt);
        } else {
            onOutOfBound && onOutOfBound(evt);
        }

        function getBounds() {
            const element = boundingElement.current?.querySelector("[data-bounding-element]");
    
            if (element) {
                return element.getBoundingClientRect();
            } else {
                return boundingElement.current?.getBoundingClientRect();
            }
        }
    
        function withinBounds(clientRect: DOMRect, position: Position) {
            if (position.x < clientRect.left || position.x > clientRect.right) {
                return false;
            }
    
            if (position.y < clientRect.top || position.y > clientRect.bottom) {
                return false;
            }
    
            return true;
        }
    }

    return (
        <div ref={boundingElement}>
            {children}
        </div>
    )
})

export default BoundingBox