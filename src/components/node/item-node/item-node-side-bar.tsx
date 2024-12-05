import { useContext } from "react";
import { ItemNodeComponentProps, NodeColorCode } from "./item-node";
import { CollectionContext } from "../../collection/Collection";
import FormBuilder from "../../form/form";
import "./item-node-side-bar.css"

const ItemNodeSideBar = ({ node } : ItemNodeComponentProps) => {
    const collection = useContext(CollectionContext);

    const handleColorCodeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const colorCode = mapToEnum(evt.target.id);

        if (colorCode) {
            collection.updateNode({
                id: node.id,
                colorCode: colorCode
            })
        } else {
            console.error(`invalid color code`);
        }

        function mapToEnum(value: string) {
            switch (value) {
                case "color-none":
                    return NodeColorCode.none;
                case "color-green":
                    return NodeColorCode.green;
                case "color-yellow":
                    return NodeColorCode.yellow;
                case "color-red":
                    return NodeColorCode.red;
                case "color-blue":
                    return NodeColorCode.blue;
                case "color-purple":
                    return NodeColorCode.purple;
                default:
                    return undefined;
            }
        }
    }

    return (
        <>
            <input type="text" className="item-node-sb__title" defaultValue={node.title} onChange={(evt) => {
                collection.updateNode({
                    id: node.id,
                    title: evt.target.value
                })
            }}/>
            <FormBuilder name={"node form"}>
                <FormBuilder.Section>
                    <FormBuilder.RadioSelect displayName="Color Code" formName="color-code" 
                    intialChecked={node.colorCode} onChange={handleColorCodeChange}>
                        <FormBuilder.RadioSelectChoice name="color-none">
                        <div className="item-node-sb__color-picker_none"
                            style={{backgroundColor: "#FFFFFF",}}></div>
                        </FormBuilder.RadioSelectChoice>
                        <FormBuilder.RadioSelectChoice name="color-green">
                            <div className="item-node-sb__color-picker"
                            style={{backgroundColor: "#74A12E"}}></div>
                        </FormBuilder.RadioSelectChoice>
                        <FormBuilder.RadioSelectChoice name="color-yellow">
                            <div className="item-node-sb__color-picker"
                            style={{backgroundColor: "#FAAC0F"}}></div>
                        </FormBuilder.RadioSelectChoice>
                        <FormBuilder.RadioSelectChoice name="color-red">
                            <div className="item-node-sb__color-picker"
                            style={{backgroundColor: "#D73A3A"}}></div>
                        </FormBuilder.RadioSelectChoice>
                        <FormBuilder.RadioSelectChoice name="color-blue">
                            <div className="item-node-sb__color-picker"
                            style={{backgroundColor: "#34B1FE"}}></div>
                        </FormBuilder.RadioSelectChoice>
                        <FormBuilder.RadioSelectChoice name="color-purple">
                            <div className="item-node-sb__color-picker"
                            style={{backgroundColor: "#893AE4"}}></div>
                        </FormBuilder.RadioSelectChoice>
                    </FormBuilder.RadioSelect>
                    <FormBuilder.TextField placeholder={"description"} initialValue={node.description} 
                        onUpdate={(value: string) => {
                            collection.updateNode({
                                id: node.id,
                                description: value
                            });
                        }
                    }/>
                </FormBuilder.Section>
            </FormBuilder>
        </>
    )
}

export default ItemNodeSideBar;