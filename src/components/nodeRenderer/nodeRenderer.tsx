import { useContext } from "react"
import { CollectionContext } from "../collection/Collection"
import OriginNode from "../node/origin-node/origin-node";
import ItemNode, { ItemNodeObject } from "../node/item-node/item-node";

const NodeRenderer = () => {
    const collectionContext = useContext(CollectionContext);

    return (
        <>
            {
                collectionContext.nodes.map((node) => {
                    const type = node.getType();

                    if (type == "origin-node") {
                        return <OriginNode node={node} key={node.id}/>
                    } else if (type == "item-node") {
                        return <ItemNode node={node as ItemNodeObject} key={node.id}/>
                    }
                })
            }
        </>
    )
}

export default NodeRenderer