import React from 'react';
import Navbar from './navbar';
import '../css/profile.css'


class CreateProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message: '',
            email: null, 
            username: null,
            password: null
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

    updateUsername(event){
        event.preventDefault();
        this.setState({username : event.target.value})
    }

    updateEmail(event){
        event.preventDefault();
        this.setState({email : event.target.value})
    }

    updatePassword(event){
        event.preventDefault();
        this.setState({password : event.target.value})
    }

    submitUser(event){
        event.preventDefault();
        
        let userCreds = this.state

        console.log(userCreds)
        console.log(JSON.stringify(userCreds))

        fetch('http://127.0.0.1:5000/create_user', {
                                            method: 'POST',
                                            mode: 'cors',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }, 
                                            credentials : 'include',
                                            body: JSON.stringify(userCreds)
                                            }
            ).then(res => {
                if(res.status == 200){
                    (res.json()).then(res => {
                        let currFetch = '/user/profile/' + res.username.toString();
                        this.props.history.push(currFetch);
                    })
                } else{
                    (res.json()).then(res => {
                        if(res.response.name == 'MongoError'){
                            if(res.response.errmsg == 'E11000 duplicate key error collection: rental-ratings.users index: email_1 dup key: { : "elon@tesla.ca" }'){
                                this.setState({message : 'An account with this email already exists.\n Please try a different email or login.'})
                            } else if(res.response.errmsg == 'E11000 duplicate key error collection: rental-ratings.users index: username_1 dup key: { : "elon999" }'){
                                this.setState({message : 'Username already taken. Try a different one.'})
                            }
                        } else if(res.response.name == 'ValidationError'){
                            if(res.response.message == 'User validation failed: password: Password must be at least 6 characters'){
                                this.setState({message : 'Password must be at least 6 characters'})
                            } else {
                                this.setState({message : 'Must provide all required credentials.'})
                            }
                        } else{
                            console.log(res.response)
                        }
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    render(){
        return(
            <div>
                <Navbar />
                <div className='signupContainer'>
                    <div id='signupCreds' className='container'>
                        <form>
                            <Email updateEmail={(event) => this.updateEmail(event)} />
                            <Username updateUsername={(event) => this.updateUsername(event)}/>
                            <Password updatePassword={(event) => this.updatePassword(event)}/>
                            <br />
                            <CreateUser submitUser={(event) => this.submitUser(event)}/>
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
            <input type="username" className="form-control signupUsername" id="usernameInput" onChange={props.updateUsername} placeholder='username'></input>
        </div>
    )
}

function Email(props){
    return(
        <div className="form-group">
            <input type="email" className="form-control signupEmail" id="emailInput" onChange={props.updateEmail} placeholder='user@example.com'></input>
        </div>
    )
}

function Password(props){
    return(
        <div className="form-group">
            <input type="password" className="form-control loginPassword" id="passwordInput" onChange={props.updatePassword} placeholder='password'></input>
        </div>  
    )
}

function CreateUser(props){
    return(

        <button type="button" className='signupButton' className="btn btn-primary btn-lg btn-block" onClick={props.submitUser}>
            Create Account
        </button>
    )
}

function Message(props){
    return(
        <p className='signupMessage'>{props.message}</p>
    )
}

export default CreateProfile