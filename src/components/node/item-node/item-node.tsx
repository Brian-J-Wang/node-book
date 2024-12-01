import { forwardRef, useContext, useImperativeHandle } from "react";
import { NodeProps } from "../interfaces";
import "./item-node.css"
import { SharedNodeFunctions } from "../node";
import ContextMenuBuilder from "../../contextMenuBuilder/contextMenuBuilder";
import { CollectionContext } from "../../collection/Collection";

export interface ItemNodeProps extends NodeProps {
    isChecked: boolean,
    title: string,
    description: string,
}

interface ItemNodeComponentProps {
    node: ItemNodeProps
}

const ItemNode = forwardRef<SharedNodeFunctions, ItemNodeComponentProps>(({node},ref) => {
    const collection = useContext(CollectionContext);

    useImperativeHandle(ref, () => ({
        getContextMenuItems: () => {
            return (
                <>
                    <ContextMenuBuilder.Divider/>
                    <ContextMenuBuilder.CMOption 
                        blurb="Delete Node"
                        onClick={() => {
                            collection.removeNode(node.id);
                        }}
                    />
                </>
            )
        },
        onLeftMouse: () => {}
    }))

    return (
        <div className="item-node__container">
            <div>
                This is an Item Node
            </div>
        </div>
    )
})



export default ItemNode