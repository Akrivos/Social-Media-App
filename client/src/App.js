import React, { useContext } from 'react';
import {makeStyles } from '@material-ui/core';
import NavBar from './components/NavBar';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ProfileOfUser from './components/ProfileOfUser';
import GlobalState, { AuthContext } from './context/GlobalContext';
import Home from './components/Home';
import EditProfile from './components/Edit-Profile';
import PostsOfProfileContext from './context/PostsOfProfileContext';
import './App.css'
import NavBarSelectorContext from './context/NavBarContext';

const useStyles = makeStyles({
  root:{
    flexGrow:1
  },
  toolBar:{
    minHeight:65,
    backgroundColor:"#26a69a"
  }
})

const App=(props)=>{
    const classes = useStyles();
    const auth=useContext(AuthContext);
    let loggedUserID = JSON.parse(localStorage.getItem('userID'));
    return(
      <div>
        <Router>
          {auth.status ?
              (<main>
                <NavBar/>
                <Switch>
                  <Route exact path={`/`}>
                      <Redirect to={`/home/${loggedUserID}`}/>
                  </Route>
                  <Route exact path={`/home/:navigateUserID`} component={Home}/>
                  <Route exact path={`/edit-profile/:navigateUserID`}  component={EditProfile}/>
                  <Route exact path={`/profile/:navigateUserID`}>
                      <PostsOfProfileContext>
                        <ProfileOfUser />
                      </PostsOfProfileContext>
                  </Route>
                </Switch>
            </main>) :
            (<main>
            <NavBar/>
              <Switch>
                  <Route path="/" exact component={SignIn}/>
                  <Route path="/signup" exact component={SignUp}/>
              </Switch>
            </main>)}
        </Router>
      </div>
  )
}

export default App;
