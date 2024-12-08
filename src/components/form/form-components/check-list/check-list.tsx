import { useState } from "react"
import { generateObjectId } from "../../../../utils/uuidGen"

import trashIcon from "../../../../assets/trash-icon.svg"

import "./check-list.css"
import "../../../../assets/styles.css"

interface checkListItem {
    id: string,
    checked: boolean,
    blurb: string
} 

type checkListProps = {
    content: checkListItem[]
    onNewItem: (item: checkListItem) => void
    checkListName: string
    showHeader?: boolean
}

const CheckList = (props: checkListProps) => {
    const [ internalId ] = useState(generateObjectId());
    const [ items, setItems ] = useState<checkListItem[]>([
        {
            id: generateObjectId(),
            checked: false,
            blurb: 'Finish this'
        },
        {
            id: generateObjectId(),
            checked: false,
            blurb: 'Finish that'
        },
    ]);

    const handleKeyboardInput = (evt: React.KeyboardEvent) => {
        if (evt.key == "Enter") {
            evt.preventDefault();

            setItems([ ...items, {
                id: generateObjectId(),
                checked: false,
                blurb: (evt.target as HTMLInputElement).value
            }]);

            (evt.target as HTMLInputElement).value = "";
        }
    }

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id != id));
    } 

    return (
        <div>
            <div className="check-list__header" hidden={props.showHeader ?? false}>
                <h4 className="check-list__title">SubTasks</h4>
                <small>0/7</small>
            </div>
            <div className="check-list__body">
                {
                    items.map((item) => <CheckListItem key={item.id} content={item} name={internalId} onDelete={handleRemoveItem}/>)
                }
                <div>
                    <input type="text" placeholder="Click here to add more" className="check-list__input" onKeyDown={handleKeyboardInput}/>
                </div>
            </div>
        </div>
    )
}

type checkListItemProps = {
    content: checkListItem
    name: string;
    onDelete: (id: string) => void;
}
const CheckListItem = ({content, onDelete}: checkListItemProps) => {
    return (
        <div className="check-list-item">
            <label htmlFor={content.id} className="check-list-item__label">
                <input type="checkbox"/>
                <p className="check-list-item__blurb">{content.blurb}</p>
            </label>
            <img src={trashIcon} alt="delete" className="check-list-item__delete" onClick={() => {
                onDelete(content.id)
            }}/>
        </div>
    )
}

CheckList.Item = CheckListItem;

export default CheckList;