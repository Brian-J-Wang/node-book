import { nodeValidation } from "../node-object"
import warningIcon from "../../../assets/warning-icon.svg"

import "./validation-notification.css"

interface ValidationNotifcationProps {
    validation: nodeValidation;
}

const ValidationNotification = (props: ValidationNotifcationProps) => {
    return props.validation.isValid 
    ? (
        <></>
    ) 
    : (
        <div className="validation">
            <img className="validation__image" src={warningIcon} alt="warning" />
            <small className="validation__message">
                {props.validation.message}
            </small>
        </div>
    )
}

export default ValidationNotification;