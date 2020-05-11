import React from 'react'
import { withRouter } from 'react-router-dom'
import '../css/navbar.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            authenticated : false,
            currUser : null
        }
    }

    checkAuthenticated(){
        fetch('http://'+process.env.REACT_APP_IP+':5000/user/is_authenticated', {
                                                            method: 'GET', 
                                                            mode: 'cors',
                                                            headers:{
                                                                'Accept' : 'application/json'
                                                            },
                                                            credentials : 'include'
                                                            }
        ).then(res => {
            if(res.status == 200){
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

    logoutAction(event){
        event.preventDefault();

        confirmAlert({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    fetch('http://'+process.env.REACT_APP_IP+':5000/logout', {
                                        method: 'GET',
                                        mode: 'cors',
                                        headers : {
                                            'Accept': 'application/json'
                                           },
                                        credentials: 'include'
                                       }
                        ).then(res => {
                            if(res.status === 200){         
                                this.setState({authenticated : false, currUser : null})
                                this.props.history.push('/login');
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