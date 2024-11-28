import { useEffect, useRef, useState } from "react"
import { Position } from "../nodeviewer/nodeviewer"

import "./edge.css"

export type EdgeProps = {
    startingNode: string,
    terminalNode: string
}

const Edge : React.FC<EdgeProps> = ({ startingNode, terminalNode }) => {
    const [startingPosition, setStartingPosition] = useState<Position>({x: 0, y: 0});
    const startingElement = useRef<HTMLElement | null>(null);
    const [terminalPosition, setTerminalPosition] = useState<Position>({x: 0, y: 0});
    const terminalElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        startingElement.current = document.getElementById(startingNode);
        terminalElement.current = document.getElementById(terminalNode);

        if (!startingElement.current || !terminalElement.current) {
            throw new Error(`Node cannot be found`);
        }

        setStartingPosition(getPosition(startingElement.current));
        setTerminalPosition(getPosition(terminalElement.current));

        const config : MutationObserverInit = {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ["style"]
        }

        const startingPositionObserver = new MutationObserver(checkForPositionChange);
        const terminalPositionObserver = new MutationObserver(checkForPositionChange);

        startingPositionObserver.observe(startingElement.current, config);
        terminalPositionObserver.observe(terminalElement.current, config);

        return () => {
            startingPositionObserver.disconnect();
            terminalPositionObserver.disconnect();
        }
    }, [])

    function getPosition(element: HTMLElement | null) {
        if (element) {
            const rect = element.getBoundingClientRect();

            return {
                x: rect.x + (rect.width / 2),
                y: rect.y + (rect.height / 2)
            };
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }

    function checkForPositionChange(mutations: MutationRecord[]) {
        if (startingElement.current == mutations[0].target) {
            setStartingPosition(getPosition(startingElement.current));
        } else {
            setTerminalPosition(getPosition(terminalElement.current));
        }
    }

    return (
        <line x1={startingPosition.x} y1={startingPosition.y} 
              x2={terminalPosition.x} y2={terminalPosition.y}
              stroke="black" strokeWidth={4} 
              strokeDasharray={4} strokeDashoffset={180} 
              className="line"
              >
        </line>
    )
}

export default Edge;