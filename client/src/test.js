import React, { useEffect, useState } from 'react'
import horizon from './images/horizon.jpg'


const App=()=>{
    //const image = require('./images/horizon.jpg')

    const [img,setImg]=useState('')

    const importImage=async(imgName)=>{
        const asd =await  import(`./images/${imgName}`)
        setImg(asd.default)
    }

    useEffect(()=>{
        importImage('horizon.jpg');
    },[])

    useEffect(()=>{
        if ( img !== ''){
            importImage('horizon.jpg');
        }
    },[img.length])

    return(
        <div>
           {<img src={img} style={{height:1000, width:500}}/>}
      </div>
    )
}
export default App;