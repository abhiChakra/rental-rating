import React from 'react';
import Navbar from './navbar';
import '../css/login.css'


class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username : null,
            password : null,
            message : null
        }
    }

    checkAuthenticated(){
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

    submitCreds(event){
        event.preventDefault();

        let userCreds = {
            'username' : this.state.username,
            'password' : this.state.password
        }

        fetch('http://127.0.0.1:5000/login', {
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

    render(){
        return(
            <div>
                <Navbar />
                <div className='loginContainer'>
                    <div id='loginCreds' className='container'>
                        <form>
                            <Username handleUsernameChange={(event) => this.handleUsernameChange(event)} />
                            <Password handlePasswordChange={(event) => this.handlePasswordChange(event)} />
                            <br/>
                            <SubmitCreds submitCreds={(event) => this.submitCreds(event)} />
                            <br />
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

function Message(props){
    return(
        <p>{props.message}</p>
    )
}

export default LoginForm