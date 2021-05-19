import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const CommentContext = React.createContext();

const CommentsOfPostContext = (props) => {
    const [updateCommentsState, setUpdateCommentsState] = useState(false)

    const updateCommentsToggle = () => {
        updateCommentsState ? setUpdateCommentsState(false) : setUpdateCommentsState(true)
    }

    return(
        <CommentContext.Provider  value={{
            updateCommentsToggle: updateCommentsToggle,
            updateCommentsState: updateCommentsState
        }}>
            {props.children}
        </CommentContext.Provider>
    )
}

export default CommentsOfPostContext;