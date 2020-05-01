import React from 'react';
import { Link } from 'react-router-dom';


class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            authenticated : false, 
            currUser : null,
            userMessage : 'Welcome! Login or signup!'
        }
    }

    componentDidMount(){
        fetch('http://127.0.0.1:5000/user/is_authenticated', {
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
                   this.setState({authenticated : true, currUser : res.username, userMessage : 'Welcome back!'})
                })
            }
        })
    }

    logoutAction(event){
        event.preventDefault();
        fetch('http://127.0.0.1:5000/logout', {
                                        method: 'GET',
                                        mode: 'cors',
                                        headers : {
                                            'Accept': 'application/json'
                                           },
                                        credentials: 'include'
                                       }
        ).then(res => {
            if(res.status === 200){         
                this.setState({authenticated : false, userMessage : 'Welcome! Login or signup!'})
                this.props.history.push('/');
            } else{
                (res.json()).then((res) => {
                    this.setState({userMessage : res.response})
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    render(){

        if(!this.state.authenticated){
            return(
                <div>
                    <p>home page</p>
                    <p>{this.state.userMessage}</p><br/>
                    <Link to='/login'>Login</Link> 
                    <br/>
                    <Link to='signup'>Sign up</Link>
                </div>
            )
        } else{
            return(
                <div>
                    <p>home page</p><br/>
                    <p>{this.state.userMessage}</p><br />
                    <Link to={'/user/profile/'+this.state.currUser}>Go to profile</Link><br/>
                    <LogoutButton authenticated={this.state.authenticated} logoutAction={(event) => this.logoutAction(event)} />
                </div>
            )
        }
        
        
    }
}

function LogoutButton(props){
    if(props.authenticated){
        return(
            <button onClick={props.logoutAction}>Logout</button>
        )
    }else{
        return(
            null
        )
    }
}

export default Home