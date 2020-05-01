import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginForm from './login';
import CreateProfile from './profile';
import Home from './home';
import UserHome from './userHome';

class Container extends React.Component {
    constructor(props){
        super(props)
    }    
    render(){
        return(
                <BrowserRouter>
                    <Switch>
                            <Route path='/' exact render={(props) => <Home {...props} />} />
                            <Route path='/user/profile/:username' exact render={(props) => <UserHome {...props} />} />
                            <Route path='/login' exact render={(props) => <LoginForm {...props} />}/>
                            <Route path='/signup' exact render={(props) => <CreateProfile {...props} />}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default Container