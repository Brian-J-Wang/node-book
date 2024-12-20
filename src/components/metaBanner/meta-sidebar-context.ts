import { createContext } from "react";

//setIsOpen is a react state function thingy.
type SidebarContextProps = {
    isOpen: boolean,
    setIsOpen: any,
}

const SidebarContext = createContext<SidebarContextProps>({
    isOpen: false,
    setIsOpen: () => {}
})

export default SidebarContext;