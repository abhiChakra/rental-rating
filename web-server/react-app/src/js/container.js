import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginForm from './login';
import CreateProfile from './profile';
import Home from './home';
import CreateListing from './createListing';
import CreateReview from './createReview';
import UpdateReview from './updateReview';
import Listing from './listing';
import UserHome from './userHome';
import Cookies from 'universal-cookie';
import ForgotPassword from './forgotPassword';
import ResetPassword from './resetPassword';

function Container() {
    const cookies = new Cookies();

    function setCookieRequest(value){
        cookies.set('token', value, [{ httpOnly : true, path : '/', sameSite : 'lax' }])
    }

    function removeCookieRequest(){
        cookies.remove('token', { path : '/'})
    }

        return(
                <BrowserRouter>
                    <div>
                            <Route path='/' exact render={(props) => <Home token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} />} />
                            <Route path='/user/profile/:username' exact render={(props) => <UserHome token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} />} />
                            <Route path='/forgot_password' exact render={(props) => <ForgotPassword token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} />}/>
                            <Route path='/reset/:token' exact render={(props) => <ResetPassword token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} />} />
                            <Route path='/listing/:id' exact render={(props) => <Listing token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} /> } />
                            <Route path='/:listingID/add_review' exact render={(props) => < CreateReview token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} />} />  
                            <Route path='/:reviewID/:listingID/update_review' exact render={(props) => <UpdateReview token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} />} />
                            <Route path='/user/create_listing' exact render={(props) => <CreateListing token={cookies.get('token')} removeCookieRequest={removeCookieRequest} {...props} />} />
                            <Route path='/login' exact render={(props) => <LoginForm token={cookies.get('token')} setCookieRequest={setCookieRequest} removeCookieRequest={removeCookieRequest} {...props} />}/>
                            <Route path='/signup' exact render={(props) => <CreateProfile token={cookies.get('token')} removeCookieRequest={removeCookieRequest} setCookieRequest={setCookieRequest} {...props}/>}/>
                    </div>   
                </BrowserRouter> 
        )
}

export default Container;