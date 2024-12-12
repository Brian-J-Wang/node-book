import { ReactNode, useContext } from "react";
import NodeWrapper from "../node-wrapper";
import ContextMenuBuilder from "../../contextMenuBuilder/contextMenuBuilder";
import { CollectionContext } from "../../collection/Collection";
import NodeObject, { NodeObjectBuilder } from "../node-object";
import { Position } from "../../../utils/math/position";
import FormBuilder from "../../form/form";
import CheckList, { checkListItem } from "../../form/form-components/check-list/check-list";

import "./item-node.css"
import "../../../assets/styles.css"

type ColorCode = "none" | "green" | "yellow" | "red" | "blue" | "purple";
export class ItemNodeObject extends NodeObject {
    checked: boolean;
    title: string;
    description: string;
    colorCode: ColorCode;
    checkList: checkListItem[];

    constructor(position: Position, id?: string) {
        super(position, id);
        this.checked = false;
        this.title = "untitled";
        this.description = "no description";
        this.colorCode = "none";
        this.checkList = [];
    }

    getType(): string {
        return "item-node"
    }

    //@ts-ignore
    //@devcl [ ] feat: add path validation to the item-node
    validate(): boolean {
        //edges must lead back to the orgin node;

        return true;
    }

    getComponent(): ReactNode {
        return (
            <ItemNode node={this} key={this.id}/>
        )
    }

    builder() {
        return new ItemNodeBuilder(this, this.update);
    }
}

class ItemNodeBuilder extends NodeObjectBuilder {
    node: ItemNodeObject;
    constructor(source: ItemNodeObject, update: () => void) {
        super(source, update);
        this.node = source
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

    checkList(value: checkListItem[]) {
        this.node.checkList = value;
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

    const numCompleteOverTotal = () => {
        let count = 0;
        node.checkList.forEach((item) => {
            if (item.checked) {
                count++;
            }
        });

        return `${count}/${node.checkList.length}`
    }

    const contextMenu = (
        <>
            <ContextMenuBuilder.Divider/>
            <ContextMenuBuilder.CMOption 
                blurb="Delete Node"
                onClick={() => {
                    collection.nodeManager.removeNode(node.id);
                }}
            />
        </>
    )

    const getColorSwatch = (code: ColorCode) => {
        return colors.find(color => color.code == code)?.color;
    }

    return (
        <NodeWrapper 
            node={node} 
            sidebar={<ItemNodeSideBar node={node} key={node.id}/>} 
            contextMenu={contextMenu}>
            <div className="item-node__container style__border">
                <div className="item-node__header">
                    <div className="item-node__header-left">
                        <input type="checkbox" className="item-node__check-box" onClick={(evt) => {evt.stopPropagation()}}/>
                        <h4 className="item-node__title">
                            {node.title}
                        </h4>
                    </div>
                    <div className="item-node__header-right">
                        <small className="item-node__check-list-count" hidden={node.checkList.length == 0}>
                            {numCompleteOverTotal()}
                        </small>
                    </div>
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
                <div style={{backgroundColor: getColorSwatch(node.colorCode)}} 
                className="item-node__color-tag" hidden={node.colorCode == "none"}></div>
            </div>
        </NodeWrapper>
    )
}

//@devcl [] refactor: find some way to have the input node updating without having to have duplicate node variable
//          in the component.
const ItemNodeSideBar: React.FC<{node: ItemNodeObject}> = ({node}) => {
    return (
        <>
            <input type="text" className="item-node-sb__title" defaultValue={node.title} onChange={(evt) => {
                node.builder().title(evt.target.value).complete()
            }}/>
            <FormBuilder name={"node form"}>
                <FormBuilder.Section>
                    <FormBuilder.RadioSelect displayName="Color Code" formName="color-code" 
                    intialChecked={node.colorCode} onChange={(evt: React.ChangeEvent) => {
                        node.builder().colorCode(evt.target.id as ColorCode).complete()
                    }}>
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
                            node.builder().description(value).complete()
                        }
                    }/>
                </FormBuilder.Section>
                <FormBuilder.Section>
                    <CheckList content={node.checkList} onUpdate={(value: checkListItem[]) => {
                        node.builder().checkList(value).complete()
                    }} checkListName={"Poggers"}/>
                </FormBuilder.Section>
            </FormBuilder>
        </>
    )
}

export default ItemNode