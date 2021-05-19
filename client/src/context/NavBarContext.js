import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const NavBarContext = React.createContext();

const NavBarSelectorContext = (props) => {
    const [selectMenu, setSelectMenu] = useState();

    const selectMenuFunction = (menu) => {
        setSelectMenu(menu);
        console.log(menu)
        localStorage.setItem('selectedMenu', JSON.stringify(menu))
    }

    const unselectMenuFunction = () => {
        setSelectMenu('');
        localStorage.setItem('selectedMenu',JSON.stringify(''));
    }

    const onRefresh = () => {
        const selectedMenu = JSON.parse(localStorage.getItem('selectedMenu'))
        console.log(selectedMenu)
        setSelectMenu(selectedMenu);
    }

    useEffect(()=>{
        onRefresh()
    },[])
    

    return(
        <NavBarContext.Provider value = {{
            selectMenuFunction: selectMenuFunction,
            unselectMenuFunction: unselectMenuFunction,
            selectMenu: selectMenu
        }}>
            {props.children}
        </NavBarContext.Provider>
    )
}

export default NavBarSelectorContext;