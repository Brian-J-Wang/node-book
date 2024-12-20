import "./meta-banner.css"
import dots from "../../assets/dots.svg"
import { useState } from "react"

const MetaBanner = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    return ( 
        <div className={"meta-banner style__border " + (!isExpanded && "meta-banner__collapsed" )} hidden>
            <button className="meta-banner__dots" onClick={() => {setIsExpanded(!isExpanded)}}>
                <img src={dots} alt="" className="meta-banner__image"/>
            </button>
        </div>
    )
}

export default MetaBanner;