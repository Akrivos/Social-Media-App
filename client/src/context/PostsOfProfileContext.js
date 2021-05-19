import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const PostContext = React.createContext();

const PostsOfProfileContext = (props) => {
    //const [posts,setPosts] = useState()
    const [updatePostsState, setUpdatePostsState] = useState(false)

    // const loadPostsOfProfilePage = async() => {
    //     const userID = JSON.parse(localStorage.getItem('userID'));
    //     await axios.get(`http://localhost:5000/post/getPostsOfUser/${userID}`).then(resp => {
    //         setPosts(resp.data)
    //     })  
    // }

    // useEffect(()=>{
    //     loadPostsOfProfilePage();
    // },[])

    const updatePostsToggle = () => {
        updatePostsState ? setUpdatePostsState(false) : setUpdatePostsState(true);
    }


    return(
        <PostContext.Provider  value={{
            updatePostsToggle: updatePostsToggle,
            updatePostsState: updatePostsState
        }}
        >
            {props.children}
        </PostContext.Provider>
    )
}

export default PostsOfProfileContext;