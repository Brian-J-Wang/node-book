import { createContext, ReactNode, useState } from "react"
import { NodeProps, NodeType } from "../node/interfaces"
import { EdgeProps } from "../edge/edge"
import { generateObjectId } from "../../utils/uuidGen"
import { Position } from "../nodeviewer/nodeviewer"
import { ItemNodeProps } from "../node/item-node/item-node"

type NodeUpdateProps = {
    id: string,
    position?: Position,
    title?: string,
    description?: string,
    isComplete?: boolean
}

type collectionContextType = {
    nodes: NodeProps[],
    edges: EdgeProps[],
    addNode: <T extends NodeProps>(props: T) => void,
    removeNode: (id: string) => void,
    updateNode: (props: NodeUpdateProps) => void
    getNodeEdges: (id: string) => EdgeProps[],
    getValidDeleteTargets: (id: string) => string[],
    getInvalidConnectTargets: (id: string) => string[]
    addEdge: (props: EdgeProps) => void,
    removeEdge: (from: string, to: string) => void 
}
export const CollectionContext = createContext<collectionContextType>({
    nodes: [],
    edges: [],
    addNode: () => {},
    removeNode: () => {},
    updateNode: () => {},
    getNodeEdges: () => [],
    getValidDeleteTargets: () => [],
    getInvalidConnectTargets: () => [],
    addEdge: () => {},
    removeEdge: () => {}
})

type collectionProps = {
    children: ReactNode;
}
const Collection = ({children}: collectionProps) => {
    const [nodes, setNodes] = useState<(NodeProps | ItemNodeProps)[]>([
        {
            id: generateObjectId(),
            type: NodeType.origin,
            position: {x: 600, y: 400}
        }
    ]);
    const [edges, setEdges] = useState<EdgeProps[]>([

    ]);

    function getNode(id: string): NodeProps | undefined {
        return nodes.find(node => node.id == id);
    }

    function addNode<T extends NodeProps>(props: T): void {
        setNodes([ ...nodes, props ]);
    }

    function removeNode(id: string): void {
        setNodes(nodes.filter(node => node.id != id));
        setEdges(edges.filter(edge => edge.startingNode != id && edge.terminalNode != id));
    }

    function updateNode(props: NodeUpdateProps) {
        setNodes(nodes.map((newNode) => {
            if (newNode.id != props.id) {
                return newNode;
            }

            Object.keys(props).forEach((key: string) => {
                if (key == props.id) {
                    return;
                }

                //@ts-ignore
                newNode[key] = props[key as keyof NodeProps];
            })

            return newNode;
        }))
    }

    function getNodeEdges(id: string): EdgeProps[] {
        return [];
    }

    enum ConnectionType {
        upStream,
        downStream,
        both
    }
    function getConnectedNodes(id: string, type: ConnectionType = ConnectionType.both): string[] {
        //if the id is found in a terminal node then the connection is upstream,
        //if it is found in the starting node then the connection is downstream,
        const connectedNodes: string[] = []

        edges.filter((edge) => {
            if (edge.startingNode == id && (type == ConnectionType.downStream || type == ConnectionType.both)) {
                connectedNodes.push(edge.terminalNode);
            } else if (edge.terminalNode == id && (type == ConnectionType.upStream || type == ConnectionType.both)) {
                connectedNodes.push(edge.startingNode);
            }
        });

        return connectedNodes;
    }

    function getValidDeleteTargets(id: string): string[] {
        return getConnectedNodes(id, ConnectionType.both);
    }

    function getInvalidConnectTargets(id: string): string[] {
        const invalidTargets: string[] = [];
        const stack: string[] = [id];
        const upstreamVisited: string[] = [];

        while(stack.length != 0) {
            const current = stack.shift();
            if (!current || upstreamVisited.includes(current)) {
                continue;
            }

            invalidTargets.push(current);
            upstreamVisited.push(current);

            const connectedNodes = getConnectedNodes(current, ConnectionType.upStream);

            stack.push( ...connectedNodes );
        }

        invalidTargets.push(...getConnectedNodes(id, ConnectionType.downStream));

        return invalidTargets;
    }

    function addEdge(props: EdgeProps) {
        setEdges([ ...edges, props ]);
    }

    function removeEdge(from: string, to: string) {
        console.log("removing edge");
        setEdges(edges.filter((edge) => {
            return !((edge.startingNode == from || edge.startingNode == to) &&
            (edge.terminalNode == from || edge.terminalNode == to))
        }));
    }

    return (
        <CollectionContext.Provider value={{nodes, edges, addNode, removeNode, updateNode, getNodeEdges, getValidDeleteTargets, getInvalidConnectTargets, addEdge, removeEdge}}>
            {children}
        </CollectionContext.Provider>
    )
}

export default Collection;