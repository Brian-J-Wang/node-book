import React, { ReactNode } from "react"
import "./radio-select.css"

interface RadioSelectProps {
    intialChecked?: string
    displayName: string,
    formName: string
    children: ReactNode
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export const RadioSelect = ({ children, formName, displayName, intialChecked, onChange }: RadioSelectProps) => {
    return (
        <div className="radio-select">
            <p className="radio-select__input-name">{displayName}:</p>
            <div className="radio-select__inputs">
                {
                    React.Children.map(children, (child) => React.isValidElement(child) && child.type === RadioChoice ? 
                    React.cloneElement<RadioChoiceProps>(child as React.ReactElement<RadioChoiceProps>,
                        {
                            groupName: formName,
                            checked: child.props.name == intialChecked,
                            onChange: onChange
                        }
                    ) : <></>)
                }
            </div>
        </div>
    )
}

type RadioChoiceProps = {
    name?: string,
    children: ReactNode
    groupName: string,
    checked: boolean
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export const RadioChoice : React.FC<RadioChoiceProps> = (props) => {
    return (
        <>
            <input type="radio" className="radio-select__radio-input" name={props.groupName} 
            onChange={props.onChange}
            id={props.name} defaultChecked={props.checked} hidden/>
            <label htmlFor={props.name} className="radio-select__choice">
                {props.children}
            </label>
        </>
        
    )
}
