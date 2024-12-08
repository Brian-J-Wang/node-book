import { useEffect, useState } from "react"
import { generateObjectId } from "../../../../utils/uuidGen"
import "./text-field.css"
import "../../form.css"

export type TextFieldProps = {
    placeholder: string
    initialValue: string
    onUpdate: (value: string) => void
}

const TextField = ({ placeholder, initialValue, onUpdate }: TextFieldProps) => {
    const [internalId] = useState<string>(generateObjectId);
    const [string, setString] = useState<string>(initialValue);

    function updateString(evt: React.FocusEvent) {
        setString(evt.target.textContent ?? "");
        onUpdate(evt.target.textContent ?? "");
    }

    function handleInput(evt: React.KeyboardEvent) {
        if (evt.key == "Enter") {
            updateString(evt as unknown as React.FocusEvent);
            (evt.target as HTMLDivElement).blur();
        }
    } 
    
    return (
        <div>
            <h3 className="text-field__display-name"> Description </h3>
            <div className="form__input"
                style={{minHeight: `calc(9em + 9px)`}}>
                
                <small contentEditable className="text-field"
                onBlur={updateString} id={internalId} 
                dangerouslySetInnerHTML={{ __html: string}} onKeyDown={handleInput}/>
            </div>
        </div>
    )
}

export default TextField;