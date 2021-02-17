import React from 'react'
import { withRouter } from 'react-router-dom'
import '../css/navbar.css'

// Using confirmAlert npm module for confirming logout
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// import { useCookies } from 'react-cookie';
// const [cookies, removeCookie] = useCookies(['token']);

// central state based navbar of app
class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            authenticated : false,
            currUser : null
        }
    }

    // check for user authentication, if authenticated, navbar displays differently
    // for example logout and UserHome instead of Login and Sign Up
    checkAuthenticated(){
        let currCookieToken = this.props.token;
        fetch('/api/user/is_authenticated', {
                                                            method: 'POST', 
                                                            mode: 'cors',
                                                            headers:{
                                                                'Content-Type' : 'application/json',
                                                                'Accept' : 'application/json'
                                                            },
                                                            body: JSON.stringify({'currUserToken' : currCookieToken}),
                                                            credentials : 'include'
                                                            }
        ).then(res => {
            if(res.status === 200){
                (res.json()).then(res => {
                    this.setState({authenticated : true, currUser : res.response.username})
                })
            } else{
                this.setState({authenticated : false, currUser : null})
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    componentDidMount(){
       this.checkAuthenticated();
    }

    // HTTP request to handle logout
    logoutAction(event){
        event.preventDefault();
        let currCookieToken = this.props.token;
        confirmAlert({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    fetch('/api/logout', {
                                        method: 'POST',
                                        mode: 'cors',
                                        headers : {
                                            'Content-Type' : 'application/json',
                                            'Accept': 'application/json'
                                           },
                                        body: JSON.stringify({'currUserToken' : currCookieToken}),
                                        credentials: 'include'
                                       }
                        ).then(res => {
                            if(res.status === 200){  
                                this.props.removeCookieRequest()       
                                this.setState({authenticated : false, currUser : null})
                                setTimeout(() => {
                                    this.props.history.push('/');
                                }, 1000)
                            } else{
                                (res.json()).then(res => {
                                    console.log(res.response)
                                })
                            }
                        }).catch((error) => {
                            console.log(error)
                        })
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
    }

    render(){
        return(
            <nav class="navbar navbar-expand-sm navbar-dark bg-dark justify-content-between">
                    <a class="navbar-brand" href='/'>RateMyRental</a>
                    <div class="navbar-nav justify-content-end">
                    {this.state.authenticated ? 
                        <ul class="nav navbar-nav">
                            <li><a class="nav-link" href={'/user/profile/' + this.state.currUser.toString()}>User Home</a></li>
                            <li><a class="nav-link" type='button' onClick={(event) => this.logoutAction(event)}>Logout</a></li>
                        </ul>
                        : 
                        <ul class="nav navbar-nav">
                            <li><a class="nav-link" href='/login'>Login</a></li>
                            <li><a class="nav-link" href='/signup'>Sign Up</a></li>
                        </ul>
                    }
                    </div>   
            </nav>
        )
    }
}

export default withRouter(Navbar);