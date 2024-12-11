import { createContext, ReactNode, useState } from "react"
import { EdgeProps } from "../edge/edge"
import NodeObject from "../node/node-object"
import { OriginNodeObject } from "../node/origin-node/origin-node"


type collectionContextType = {
    nodes: NodeObject[],
    edges: EdgeProps[],
    addNode: (props: NodeObject) => void,
    updateNode: (props: NodeObject) => void
    removeNode: (id: string) => void,
    getValidDeleteTargets: (id: string) => string[],
    getInvalidConnectTargets: (id: string) => string[]
    addEdge: (props: EdgeProps) => void,
    removeEdge: (from: string, to: string) => void 
}
export const CollectionContext = createContext<collectionContextType>({
    nodes: [],
    edges: [],
    addNode: () => {},
    updateNode: () => {},
    removeNode: () => {},
    getValidDeleteTargets: () => [],
    getInvalidConnectTargets: () => [],
    addEdge: () => {},
    removeEdge: () => {}
})

type collectionProps = {
    children: ReactNode;
}
const Collection = ({children}: collectionProps) => {
    const [nodes, setNodes] = useState<(NodeObject)[]>([
        new OriginNodeObject({x: 2500, y: 2500})
    ]);
    const [edges, setEdges] = useState<EdgeProps[]>([]);

    function addNode(node: NodeObject): void {
        setNodes([ ...nodes, node]);
    }

    function removeNode(id: string): void {
        setNodes(nodes.filter(node => node.id != id));
        setEdges(edges.filter(edge => edge.startingNode != id && edge.terminalNode != id));
    }

    function updateNode(updatedNode: NodeObject) {
        const updatedNodes = nodes.map((node) => {
            if (node.id == updatedNode.id) {
                return updatedNode;
            } else {
                return node;
            }
        });

        console.log(updatedNode.validate(updatedNodes, edges));

        setNodes(updatedNodes);
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
            console.log(connectedNodes);

            stack.push( ...connectedNodes );
        }

        invalidTargets.push(...getConnectedNodes(id, ConnectionType.downStream));

        return invalidTargets;
    }

    function addEdge(props: EdgeProps) {
        const newEdges = [ ...edges, props ]
        setEdges(newEdges);
        setNodes(nodes.filter((node) => {
            if (node.id == props.startingNode || node.id == props.terminalNode) {
                node.validationMessage = node.validate(nodes, newEdges);
                return node.builder().complete();
            } else {
                return node;
            }
        }))
    }

    function removeEdge(from: string, to: string) {
        const newEdges = edges.filter((edge) => {
            return !((edge.startingNode == from || edge.startingNode == to) &&
            (edge.terminalNode == from || edge.terminalNode == to))
        });
        setEdges(newEdges);

        setNodes(nodes.filter((node) => {
            if (node.id == from || node.id == to) {
                node.validationMessage = node.validate(nodes, newEdges);
                return node.builder().complete();
            } else {
                return node;
            }
        }))
    }

    return (
        <CollectionContext.Provider value={{nodes, edges, addNode, removeNode, updateNode, getValidDeleteTargets, getInvalidConnectTargets, addEdge, removeEdge}}>
            {children}
        </CollectionContext.Provider>
    )
}

export default Collection;