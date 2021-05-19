import { SnackbarProvider,useSnackbar  } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ProfileOfUser from './components/ProfileOfUser';
import CommentsOfPostContext from './context/CommentsOfPostContext';
import GlobalState from './context/GlobalContext';
import NavBarSelectorContext from './context/NavBarContext';
import PostsOfProfileContext from './context/PostsOfProfileContext';


ReactDOM.render(
    <GlobalState>
        <NavBarSelectorContext>
            <CommentsOfPostContext>
                <SnackbarProvider>
                    <App/>
                </SnackbarProvider>
            </CommentsOfPostContext>
        </NavBarSelectorContext>
    </GlobalState> ,
     document.getElementById('root'));


