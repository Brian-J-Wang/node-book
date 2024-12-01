import { useContext } from "react"
import { CollectionContext } from "../collection/Collection"
import Node from "../node/node"
import { NodeProps } from "../node/interfaces";

const NodeRenderer = () => {
    const collectionContext = useContext(CollectionContext);

    return (
        <>
            {
                collectionContext.nodes.map((node) => {
                    return (
                        <Node key={node.id} node={node}></Node>
                    )
                })
            }
        </>
    )
}

export default NodeRenderer