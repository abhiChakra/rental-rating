import React from 'react';
import Navbar from './navbar';
import '../css/login.css'
// import { useCookies } from 'react-cookie';
// const [setCookie] = useCookies(['token']);

// Login page
class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username : null,
            password : null,
            message : null
        }
    }

    // check to see if user authenticated, if so, then redirecting to home
    checkAuthenticated(){
        fetch('http://'+process.env.REACT_APP_IP+':5000/user/is_authenticated', {
                                                            method: 'POST', 
                                                            mode: 'cors',
                                                            headers:{
                                                                'Content-Type' : 'application/json',
                                                                'Accept' : 'application/json'
                                                            },
                                                            body: JSON.stringify({'currUserToken' : this.props.token}),
                                                            credentials : 'include'
                                                            }
        ).then(res => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.props.history.push('/user/profile/' + res.response.username)
                })
            } else{
                return null;
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    componentDidMount(){
       this.checkAuthenticated();
    }

    handleUsernameChange(event){
        this.setState({username : event.target.value})
    }

    handlePasswordChange(event){
        this.setState({password : event.target.value})
    }

    // HTTP request to submit user credentials and handle login
    submitCreds(event){
        event.preventDefault();

        let userCreds = {
            'username' : this.state.username,
            'password' : this.state.password
        }

        fetch('http://'+process.env.REACT_APP_IP+':5000/login', {
                                            method: 'POST', 
                                            mode: 'cors',
                                            headers: {
                                                'Content-Type' : 'application/json',
                                                'Accept' : 'application/json'
                                            },
                                            body:JSON.stringify(userCreds),
                                            credentials : 'include'
                                            }
        ).then((res) => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.props.setCookieRequest(res.currToken)
                    let fetchURL = '/user/profile/' + res.username.toString();
                    this.props.history.push(fetchURL);
                })
            } else{
                (res.json()).then((res) => {
                    this.setState({message : res.response, authenticated : false})
                })
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    // redirect to forgot password page
    handleForgotPassword(event){
        event.preventDefault();

        this.props.history.push('/forgot_password');
    }

    render(){
        return(
            <div>
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                <div className='loginContainer'>
                    <div id='loginCreds' className='container'>
                        <form>
                            <Username handleUsernameChange={(event) => this.handleUsernameChange(event)} />
                            <Password handlePasswordChange={(event) => this.handlePasswordChange(event)} />
                            <br/>
                            <SubmitCreds submitCreds={(event) => this.submitCreds(event)} />
                            <br />
                            <ForgotPassword handleForgotPassword={(event) => this.handleForgotPassword(event)}/>
                        </form>
                        <Message message={this.state.message} />
                    </div>
                </div>
            </div>
        )
    }
}

function Username(props){
    return(
        <div className="form-group">
            <input type="username" className='loginUsername' className="form-control" id="usernameInput" onChange={props.handleUsernameChange} placeholder='username'></input>
        </div>
    )
}

function Password(props){
    return(
        <div className="form-group">
            <input type="password" className='loginPassword' className="form-control" id="passwordInput" onChange={props.handlePasswordChange} placeholder='password'></input>
        </div>   
    )
}


function SubmitCreds(props){
    return(
        <button type="button" className='loginButton' className="btn btn-primary btn-lg btn-block"  onClick={props.submitCreds}>
            Login
        </button>
    )
}

function ForgotPassword(props){
    return(
        <button type="button" className='loginButton' className="btn btn-link"  onClick={props.handleForgotPassword}>
            Forgot Password
        </button>
    )
}

function Message(props){
    return(
        <p className='loginMessage'>{props.message}</p>
    )
}

export default LoginForm