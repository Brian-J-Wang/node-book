import { useContext, useEffect, useRef, useState } from "react"
import { Position } from "../../utils/math/position"

import "./edge.css"
import { CanvasContext } from "../../properties/canvas/canvas"
import { CollectionContext } from "../collection/Collection"
import { Node } from "../../utils/graph"
import NodeObject from "../node/node-object"
import { OriginNodeObject } from "../node/origin-node/origin-node"
import { ItemNodeObject } from "../node/item-node/item-node"

export type EdgeProps = {
    startingNode: string,
    terminalNode: string
}

const Edge : React.FC<EdgeProps> = ({ startingNode, terminalNode }) => {
    const [startingPosition, setStartingPosition] = useState<Position>({x: 0, y: 0});
    const startingElement = useRef<HTMLElement | null>(null);
    const [terminalPosition, setTerminalPosition] = useState<Position>({x: 0, y: 0});
    const terminalElement = useRef<HTMLElement | null>(null);
    const canvasContext = useContext(CanvasContext);

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
                x: rect.x + (canvasContext.viewPortPosition.current?.x ?? 0) + (rect.width / 2),
                y: rect.y + (canvasContext.viewPortPosition.current?.y ?? 0) + (rect.height / 2)
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

    function subDividePath(subDivisions: number) {
        if (subDivisions <= 0) {
            subDivisions = 1;
        }

        const delX = (terminalPosition.x - startingPosition.x) / subDivisions;
        const delY = (terminalPosition.y - startingPosition.y) / subDivisions;
        
        const points: Position[] = Array(subDivisions)

        for (let i = 1; i < subDivisions + 1; i++) {
            points[i] = {
                x: startingPosition.x + (delX * i),
                y: startingPosition.y + (delY * i)
            }
        }

        return `M${startingPosition.x} ${startingPosition.y}` + points.map((point) => `L${point.x} ${point.y}`).join(' ');
    }

    const collectionContext = useContext(CollectionContext);
    function pathFactory() {
        const startNode = collectionContext.nodeManager?.getNode(startingNode);
        const endNode = collectionContext.nodeManager?.getNode(terminalNode);

        if (startNode && endNode) {
            const startChecked = calculateChecked(startNode as Node<NodeObject>);
            const endChecked = calculateChecked(endNode as Node<NodeObject>);

            function calculateChecked(node: Node<NodeObject>) {
                if (node.content instanceof OriginNodeObject) {
                    return true;
                } else if (node.content instanceof ItemNodeObject) {
                    return node.content.checked;
                }
            }

            if (!startChecked && !endChecked) {
                return (
                    <path d={subDividePath(4)}
                    stroke="white" strokeWidth={6}
                    className="line"
                    />
                )
            } else if ((!startChecked && endChecked) || (startChecked && !endChecked)) {
                return (
                    <path d={subDividePath(4)}
                    stroke="white" strokeWidth={6}
                    className="line"
                    markerMid="url(#arrow)"
                    />
                )
            } else {
                return (
                    <path d={subDividePath(4)}
                    stroke="black" strokeWidth={6}
                    className="line"
                    />
                )
            }

        } else {
            return <></>
        }
    }

    return (
        <>
            <line
            x1={startingPosition.x} y1={startingPosition.y}
            x2={terminalPosition.x} y2={terminalPosition.y}
            stroke="#292929" strokeWidth={8} opacity={'100%'}
            />
            {
                pathFactory()
            }
        </>
    )
}

export default Edge;