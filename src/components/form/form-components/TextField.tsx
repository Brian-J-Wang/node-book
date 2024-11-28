import { useEffect, useState } from "react"
import { generateObjectId } from "../../../utils/uuidGen"
import "../form.css"

type TextFieldProps = {
    placeholder: string
    initialValue: string
}

const TextField = ({ placeholder, initialValue }: TextFieldProps) => {
    const [internalId] = useState<string>(generateObjectId);
    const [string, setString] = useState<string>(initialValue);

    useEffect(() => {
        // const element = document.getElementById(internalId);

        // if (element) {
        //     element.textContent = placeholder;
        // }
    }, [])
    
    function onFocus(evt: React.FocusEvent) {
        
    }

    function onBlur(evt: React.FocusEvent) {

    }

    function captureInput(evt: any) {
        
    }

    function getString() {
        if (string === "" ){
            return placeholder;
        } else {
            return string;
        }
    }

    function getStyling() {
        let style = "form__text-field ";

        if (string == "") {
            style += "form__text-field__placeholder";
        } else {
            style += "form__text-field__string";
        }

        return style;
    }
    
    return (
        <div className="form__input form__input__text-field">
            <p contentEditable className={getStyling()} onFocus={onFocus} 
            onBlur={onBlur} onInput={captureInput} id={internalId} 
            dangerouslySetInnerHTML={{ __html: string}}/>
        </div>
    )
}

export default TextField;