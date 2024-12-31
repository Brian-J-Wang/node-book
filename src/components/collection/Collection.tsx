import { createContext, ReactNode, useEffect, useRef, useState } from "react"
import NodeObject from "../node/node-object"
import { OriginNodeObject } from "../node/origin-node/origin-node";
import { Node } from "../../utils/graph";
import NodeManager from "../node/node-manager";


type collectionContextType = {
    nodes: Node<NodeObject>[];
    nodeManager: NodeManager | null
}

const initialNodeSet = [
    new OriginNodeObject({x: 2500, y: 2500})
];

//@ts-ignore
export const CollectionContext = createContext<collectionContextType>();

type collectionProps = {
    children: ReactNode;
}

const Collection = ({ children }: collectionProps) => {
    const [nodes, setNodes] = useState<Node<NodeObject>[]>([]);
    const nodeManager = useRef<NodeManager | null>(null);

    useEffect(() => {
        if (nodeManager.current == null) {
            nodeManager.current = new NodeManager(setNodes, initialNodeSet);
            nodeManager.current.update();
        }
    }, [])

    return (
        <CollectionContext.Provider value={{nodes: nodes, nodeManager: nodeManager.current}}>
            {children}
        </CollectionContext.Provider>
    )
}

export default Collection;