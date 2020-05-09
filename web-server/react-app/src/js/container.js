import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginForm from './login';
import CreateProfile from './profile';
import Home from './home';
import CreateListing from './createListing';
import CreateReview from './createReview';
import Listing from './listing';
import UserHome from './userHome';


class Container extends React.Component {
    constructor(props){
        super(props);
    }    

    render(){
        return(
                <BrowserRouter>
                    <div>
                        <Switch>
                            <Route path='/' exact render={(props) => <Home {...props} />} />
                            <Route path='/user/profile/:username' exact render={(props) => <UserHome {...props} />} />
                            <Route path='/listing/:id' exact render={(props) => <Listing {...props} /> } />
                            <Route path='/:listingID/add_review' exact render={(props) => < CreateReview {...props} />} />  
                            <Route path='/user/create_listing' exact render={(props) => <CreateListing {...props} />} />
                            <Route path='/login' exact render={(props) => <LoginForm {...props} />}/>
                            <Route path='/signup' exact render={(props) => <CreateProfile {...props}/>}/>
                        </Switch>
                    </div>   
                </BrowserRouter>
        )
    }
}

export default Container;