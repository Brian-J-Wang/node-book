import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Position } from "../../components/nodeviewer/nodeviewer";

type DetectOutOfBoundProps = {
    children: ReactNode,
    boundingElement: React.RefObject<HTMLElement | null>;
    onBound?: (evt: MouseEvent) => void,
    onOutOfBound?: (evt: MouseEvent) => void,
}

export type OutofBoundsHandle = {
    setListen: (value: boolean) => void;
}

const DetectOutOfBounds = forwardRef<OutofBoundsHandle, DetectOutOfBoundProps>(({children, boundingElement, onBound, onOutOfBound}, ref) => {
    const listen = useRef<boolean>(false);

    useImperativeHandle(ref, () => ({
        setListen: (value) => {
            listen.current = value;
        }
    }));

    //cleans up event listeners in case this component gets unmounted.
    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        }
    }, [])

    function handleMouseDown(evt: MouseEvent) {
        if (!listen.current || evt.button != 0) {
            return;
        }

        const clientRect = boundingElement.current?.getBoundingClientRect();

        if (clientRect && withinBounds(clientRect, {
            x: evt.clientX,
            y: evt.clientY
        })) {
            onBound && onBound(evt);
        } else {
            onOutOfBound && onOutOfBound(evt);
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
    

    return (
        <>
            {children}
        </>
    )
})

export default DetectOutOfBounds