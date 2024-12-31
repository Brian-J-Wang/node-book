import { useContext } from "react"
import { CollectionContext } from "../collection/Collection"
import NodeObject from "../node/node-object";
import { Node } from "../../utils/graph";
import OriginNode, { OriginNodeObject } from "../node/origin-node/origin-node";
import ItemNode, { ItemNodeObject } from "../node/item-node/item-node";

const NodeRenderer = () => {
    const collection = useContext(CollectionContext);

    return (
        <>
            {
                collection.nodes.map((node) => {
                    return NodeFactory(node);
                })
            }
        </>
    )
}

const NodeFactory = (node: Node<NodeObject>) => {
    const { content } = node;

    if (content instanceof OriginNodeObject) {
        return <OriginNode node={node} key={node.id} />
    } else if (content instanceof ItemNodeObject) {
        return <ItemNode node={node as Node<ItemNodeObject>} key={node.id} />
    } else {
        return <></>
    }
}

export default NodeRenderer