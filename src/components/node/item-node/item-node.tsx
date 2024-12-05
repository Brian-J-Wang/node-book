import { forwardRef, useContext, useImperativeHandle } from "react";
import { NodeProps } from "../interfaces";
import "./item-node.css"

import { SharedNodeFunctions } from "../node";
import ContextMenuBuilder from "../../contextMenuBuilder/contextMenuBuilder";
import { CollectionContext } from "../../collection/Collection";
import ItemNodeSideBar from "./item-node-side-bar";

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
        getSideBarItems: () => (
            <ItemNodeSideBar node={node}></ItemNodeSideBar>
        ),
        onLeftMouse: () => {},
    }))

    return (
        <div className="item-node__container">
            <div className="item-node__header">
                <input type="checkbox" className="item-node__check-box" onClick={(evt) => {evt.stopPropagation()}}/>
                <h4 className="item-node__title">
                    {node.title}
                </h4>
            </div>
            {
                node.description != "" && (
                    <div className="item-node__body">
                        <small className="item-node__description">
                            {node.description}
                        </small>
                    </div>
                )
            }
            
        </div>
    )
})

export enum NodeColorCode {
    none = "color-none",
    green = "color-green",
    yellow = "color-yellow",
    red = "color-red",
    blue = "color-blue",
    purple = "color-purple"
}

export interface ItemNodeProps extends NodeProps {
    isChecked: boolean,
    title: string,
    description: string,
    colorCode: NodeColorCode
}

export interface ItemNodeComponentProps {
    node: ItemNodeProps
}

export default ItemNode