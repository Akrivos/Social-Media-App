import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const AuthContext = React.createContext();

const GlobalState=(props)=>{
    const [callback, setCallback] = useState(null);
    const [userInfo, setUserInfo] = useState({
        status: false,
        message: null,
        userID: null,
        name: null,
        email: null
    })

    const onRefreshPage=()=>{
        if (JSON.parse(localStorage.getItem('token'))){
            setUserInfo({...userInfo, status: true})
        }
    }

    useEffect(()=>{
        onRefreshPage()
    },[])

    const isLoggedIn = async(email,password,callback) => {
            if (JSON.parse(localStorage.getItem('token') === null )){
                const resp = await axios.post('http://localhost:5000/user/signin', {email: email, password: password});
                    if (resp.data.status === true){
                        localStorage.setItem('emailOfUser', JSON.stringify(resp.data.email));
                        localStorage.setItem('userID', JSON.stringify(resp.data.id));
                        localStorage.setItem('nameOfUser', JSON.stringify(resp.data.name));
                        localStorage.setItem('token', JSON.stringify(resp.data.accessToken));
                    
                        setUserInfo({
                            userID: resp.data.id,
                            status:true,
                            name: resp.data.name,
                            email: resp.data.email,
                            message: ''
                        })
                        setCallback(()=>callback(true))
                    }else{
                        setUserInfo({
                            userID: resp.data.id,
                            status: false,
                            message: resp.data.message,
                            name: resp.data.name,
                            email: resp.data.email,
                        })
                        setCallback(()=>callback(false))
                    }
                
            }
    }

    const isLoggedOut = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('userID')
        localStorage.removeItem('nameOfUser');
        localStorage.removeItem('emailOfUser');
        setUserInfo({...userInfo, status:false});
        console.log(userInfo)
    }

    return(
        <AuthContext.Provider value={{
            isLoggedIn: isLoggedIn,
            isLoggedOut: isLoggedOut,
            status: userInfo.status,
            name: userInfo.name,
            email: userInfo.email,
            userID: userInfo.userID,
            message: userInfo.message
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}
export default GlobalState;