import { useContext } from "react"
import { CollectionContext } from "../collection/Collection"
import OriginNode, { OriginNodeObject } from "../node/origin-node/origin-node";
import ItemNode, { ItemNodeObject } from "../node/item-node/item-node";
import NodeObject from "../node/node-object";

const NodeRenderer = () => {
    const collection = useContext(CollectionContext);

    return (
        <>
            {
                collection.nodeManager.nodes.map((node) => 
                    nodeComponentFactory(node)
                )
            }
        </>
    )
}

function nodeComponentFactory(node: NodeObject) {
    if (node instanceof OriginNodeObject) {
        return <OriginNode node={node} key={node.id}/>
    } else if (node instanceof ItemNodeObject) {
        return <ItemNode node={node as ItemNodeObject} key={node.id}/>
    } else {
        return <></>
    }
}

export default NodeRenderer