import "./main-menu.css"
import dots from "../../assets/dots.svg"
import { RefObject, useEffect, useRef, useState } from "react"
import BoundingBox, { OutofBoundsHandle } from "../../properties/detectOutofBounds/boundingBox";

import home from "../../assets/bootstrap-icons/home.svg";

import linkedIn from "../../assets/bootstrap-socials/linkedin.svg";
import github from "../../assets/bootstrap-socials/github.svg";
import twitter from "../../assets/bootstrap-socials/twitter.svg";

import cheveronRight from "../../assets/bootstrap-icons/cheveron-right.svg";
import cheveronLeft from "../../assets/bootstrap-icons/cheveron-left.svg";

const MainMenu = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const boundingBox = useRef<OutofBoundsHandle>() as RefObject<OutofBoundsHandle>;

    useEffect(() => {
        if (isExpanded) {
            boundingBox.current?.setListen(true);
        } else {
            boundingBox.current?.setListen(false);
        }
    }, [isExpanded])

    return ( 
        <div className={"meta-banner " + (!isExpanded && "meta-banner__collapsed" )} hidden>
            <BoundingBox ref={boundingBox} onOutOfBound={() => { setIsExpanded(false)}}>
            <div className="meta-banner__menu">
                <div className="menu__header">
                    <button className="menu__home-button">
                        <img src={home} alt="home" className="menu__home-icon" />
                    </button>
                    <h1 className="menu__title">
                        Collection Name
                    </h1>
                </div>
                <div className="menu__footer">
                    <div className="menu__socials">
                        <a href="https://www.linkedin.com/in/brian-j-wang/">
                            <img className="menu__social-icon" src={linkedIn} alt="Linkedin" />
                        </a>
                        <a href="https://github.com/Brian-J-Wang/node-book">
                            <img className="menu__social-icon" src={github} alt="Github" />
                        </a>
                        <a href="">
                            <img className="menu__social-icon" src={twitter} alt="Twitter" />
                        </a>
                    </div>
                    <small className="menu__footer-blurb">
                        Created by Brian Wang 2024
                    </small>
                </div>
            </div>
            </BoundingBox>
            <button className="meta-banner__tab" onClick={() => {setIsExpanded(!isExpanded)}}>
                {
                    isExpanded
                    ? <img src={cheveronLeft} alt="" className="meta-banner__image"/>
                    : <img src={cheveronRight} alt="" className="meta-banner__image"/>
                }
            </button>
        </div>
    )
}

export default MainMenu;