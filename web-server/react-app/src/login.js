import React from 'react';
import { Link } from 'react-router-dom';


class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username : null,
            password : null,
            message : null,
            authenticated : false
        }
    }

    componentDidMount(){
        fetch('http://127.0.0.1:5000/user/is_authenticated', {
                                                    method: 'GET',
                                                    mode: 'cors',
                                                    headers:{
                                                        'Accept' : 'application/json'
                                                    },
                                                    credentials: 'include'
                                                    }
        ).then((res) => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({authenticated : true})
                    let currFetch = '/user/profile/' + res.username.toString();
                    this.props.history.push(currFetch);
                })
            } else{
                this.setState({authenticated : false})
            }
        }).catch((error) => {
            console.log(error)
        })
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
                    this.setState({authenticated : true});
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
                <p>login page</p>
                <Link to='/'>Home</Link>

                <br />
                <Username handleUsernameChange={(event) => this.handleUsernameChange(event)} />
                <br />
                <Password handlePasswordChange={(event) => this.handlePasswordChange(event)} />
                <br />
                <SubmitCreds submitCreds={(event) => this.submitCreds(event)} />
                <br />

                <Message message={this.state.message} />
            </div>
        )
    }
}

function Username(props){
    return(
        <input onChange={props.handleUsernameChange} placeholder='username'></input>
    )
}

function Password(props){
    return(
        <input type='password' onChange={props.handlePasswordChange} placeholder='password'></input>
    )
}

function SubmitCreds(props){
    return(
        <button onClick={props.submitCreds}>Login!</button>
    )
}

function Message(props){
    return(
        <p>{props.message}</p>
    )
}

export default LoginForm