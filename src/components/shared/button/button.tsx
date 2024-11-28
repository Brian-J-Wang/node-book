import { ReactNode } from "react";

import "./button.css"

type buttonProps = {
    onClick: () => void,
    children?: ReactNode,
    className?: string
}

const Button = ({ onClick , children, className}: buttonProps) => {
    return (
        <button onClick={onClick} className={className ?? ""}>
            {children}
        </button>
    )
}

type deleteButtonProps = {
    onClick: () => void
}
const DestructiveButton = ({onClick}: deleteButtonProps) => {
    return (
        <Button onClick={onClick} className="delete-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L19 19M1 19L19 1" stroke="black" strokeWidth="2" className="delete-button__cross"/>
            </svg>
        </Button>
    )
}

Button.Destructive = DestructiveButton;
export default Button;