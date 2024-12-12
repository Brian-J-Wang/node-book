import { createContext, ReactNode, useRef, useState } from "react"
import NodeObject from "../node/node-object"
import { OriginNodeObject } from "../node/origin-node/origin-node"
import NodeManager from "../node/node-manager"


type collectionContextType = {
    nodeManager: NodeManager
}

//@ts-ignore
export const CollectionContext = createContext<collectionContextType>()

type collectionProps = {
    children: ReactNode;
}
const Collection = ({children}: collectionProps) => {
    const [nodes, setNodes] = useState<NodeObject[]>([
        new OriginNodeObject({x: 2500, y: 2500})
    ]);
    const nodeManager = useRef<NodeManager>(new NodeManager(setNodes, nodes));

    return (
        <CollectionContext.Provider value={{nodeManager: nodeManager.current}}>
            {children}
        </CollectionContext.Provider>
    )
}

export default Collection;