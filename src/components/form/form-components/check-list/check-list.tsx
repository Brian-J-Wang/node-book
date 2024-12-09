import { useEffect, useState } from "react"
import { generateObjectId } from "../../../../utils/uuidGen"

import trashIcon from "../../../../assets/trash-icon.svg"

import "./check-list.css"
import "../../../../assets/styles.css"

export interface checkListItem {
    id: string,
    checked: boolean,
    blurb: string
} 

type checkListProps = {
    content: checkListItem[]
    onUpdate: (items: checkListItem[]) => void;
    checkListName: string
    showHeader?: boolean
}

const CheckList = (props: checkListProps) => {
    const [ internalId ] = useState(generateObjectId());
    const [ numComplete, setNumComplete] = useState<number>(0);
    const [ items, setItems ] = useState<checkListItem[]>(props.content);

    useEffect(() => {
        //set the number complete;
        let count = 0;
        props.content.forEach((item) => {
            if (item.checked) {
                count++;
            }
        });

        setNumComplete(count);
    }, [ props.content ]);

    const handleKeyboardInput = (evt: React.KeyboardEvent) => {
        if (evt.key == "Enter") {
            evt.preventDefault();

            const newState = [ ...items, {
                id: generateObjectId(),
                checked: false,
                blurb: (evt.target as HTMLInputElement).value
            }]
            setItems(newState);
            props.onUpdate(newState);

            (evt.target as HTMLInputElement).value = "";
        }
    }

    const handleRemoveItem = (id: string) => {
        const newState = items.filter(item => item.id != id)
        setItems(newState);
        props.onUpdate(newState);
    } 

    const handleCheck = (evt: React.ChangeEvent) => {
        const newState = items.map((item) => {
            if (item.id == evt.target.id) {
                item.checked = (evt.target as HTMLInputElement).checked;
            }

            return item;
        })
        setItems(newState);
        props.onUpdate(newState);

        if ((evt.target as HTMLInputElement).checked) {
            setNumComplete((value) => value + 1);
        } else {
            setNumComplete((value) => value - 1);
        }
    }

    return (
        <div>
            <div className="check-list__header" hidden={props.showHeader ?? false}>
                <h4 className="check-list__title">SubTasks</h4>
                <small>{`${numComplete}/${items.length}`}</small>
            </div>
            <div className="check-list__body">
                {
                    items.map((item) => <CheckListItem key={item.id} id={item.id} content={item} 
                    name={internalId} onDelete={handleRemoveItem} onChange={handleCheck}/>)
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
    id: string;
    onDelete: (id: string) => void;
    onChange: (evt: React.ChangeEvent) => void;
}
const CheckListItem = ({content, id, onDelete, onChange}: checkListItemProps) => {
    return (
        <div className="check-list-item">
            <label htmlFor={content.id} className="check-list-item__label">
                <input type="checkbox" id={id} onChange={onChange} checked={content.checked}/>
                <small className="check-list-item__blurb">{content.blurb}</small>
            </label>
            <img src={trashIcon} alt="delete" className="check-list-item__delete" onClick={() => {
                onDelete(content.id)
            }}/>
        </div>
    )
}

CheckList.Item = CheckListItem;

export default CheckList;