import { ReactNode, useContext } from "react";
import "./item-node.css"
import NodeWrapper from "../node-wrapper";
import ContextMenuBuilder from "../../contextMenuBuilder/contextMenuBuilder";
import { CollectionContext } from "../../collection/Collection";
import NodeObject, { NodeObjectBuilder } from "../node-object";
import { Position } from "../../../utils/math/position";
import FormBuilder from "../../form/form";
import { OriginNodeObject } from "../origin-node/origin-node";


type ColorCode = "none" | "green" | "yellow" | "red" | "blue" | "purple";
export class ItemNodeObject extends NodeObject {
    checked: boolean;
    title: string;
    description: string;
    colorCode: ColorCode;

    constructor(position: Position, id?: string) {
        super(position, id);
        this.checked = false;
        this.title = "untitled";
        this.description = "no description";
        this.colorCode = "none";
    }

    getType(): string {
        return "item-node"
    }

    getComponent(): ReactNode {
        return (
            <ItemNode node={this} key={this.id}/>
        )
    }

    builder() {
        return new ItemNodeBuilder(this);
    }
}

class ItemNodeBuilder extends NodeObjectBuilder {
    node: ItemNodeObject;
    constructor(source: OriginNodeObject) {
        super(source);
        this.node = new ItemNodeObject({x: 0, y: 0});
        this.node = Object.assign(this.node, source);
    }

    checked(value: boolean) {
        this.node.checked = value;
        return this;
    }

    title(value: string) {
        this.node.title = value;
        return this;
    }

    description(value: string) {
        this.node.description = value;
        return this;
    }

    colorCode(value: ColorCode) {
        this.node.colorCode = value;
        return this;
    }
}

type ItemNodeProps = {
    node: ItemNodeObject
}

const colors: { code: ColorCode, color: string }[] = [
    {
        code: "none",
        color: "#FFFFFF"
    },
    {
        code: "green",
        color: "#74A12E"
    },
    {
        code: "yellow",
        color: "#FAAC0F"
    },
    {
        code: "red",
        color: "#D73A3A"
    },
    {
        code: "blue",
        color: "#34B1FE"
    },
    {
        code: "purple",
        color: "#893AE4"
    }
]

const ItemNode = ({node} : ItemNodeProps) => {
    const collection = useContext(CollectionContext);

    const contextMenu = (
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

    return (
        <NodeWrapper 
            node={node} 
            sidebar={<ItemNodeSideBar node={node} key={node.id}/>} 
            contextMenu={contextMenu}>
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
        </NodeWrapper>
    )
}


const ItemNodeSideBar: React.FC<{node: ItemNodeObject}> = ({node}) => {
    const collection = useContext(CollectionContext);

    const handleColorCodeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        collection.updateNode(node.builder().colorCode(evt.target.id as ColorCode).complete());
    }

    return (
        <>
            <input type="text" className="item-node-sb__title" defaultValue={node.title} onChange={(evt) => {
                collection.updateNode(node.builder().title(evt.target.value).complete());
            }}/>
            <FormBuilder name={"node form"}>
                <FormBuilder.Section>
                    <FormBuilder.RadioSelect displayName="Color Code" formName="color-code" 
                    intialChecked={node.colorCode} onChange={handleColorCodeChange}>
                        {
                            colors.map(color => (
                                <FormBuilder.RadioSelectChoice id={color.code} key={color.code}>
                                    <div className="item-node-sb__color-picker"
                                    style={{backgroundColor: color.color}}/>
                                </FormBuilder.RadioSelectChoice>
                            ))
                        }
                    </FormBuilder.RadioSelect>
                    <FormBuilder.TextField placeholder={"description"} initialValue={node.description} 
                        onUpdate={(value: string) => {
                            collection.updateNode(node.builder().description(value).complete());
                        }
                    }/>
                </FormBuilder.Section>
            </FormBuilder>
        </>
    )
}

export default ItemNode