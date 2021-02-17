import React from 'react';
import Navbar from './navbar';
import '../css/profile.css';
//import Recaptcha from 'react-recaptcha';
// import { useCookies } from 'react-cookie';
// const [setCookie] = useCookies(['token']);

// app signup page
class CreateProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            signupMessage: '',
            email: null, 
            username: null,
            password: null,
        }
    }

    // check to see if user authenticated, if so, then redirecting to home
    checkAuthenticated(){
        fetch('/api/user/is_authenticated', {
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
            if(res.status === 200){
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

    // HTTP request to submit details and create new user
    submitUser(event){
        event.preventDefault();
        
        let userCreds = this.state

        fetch('/api/create_user', {
                                            method: 'POST',
                                            mode: 'cors',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }, 
                                            credentials : 'include',
                                            body: JSON.stringify(userCreds)
                                            }
            ).then(res => {
                if(res.status === 200){
                    (res.json()).then(res => {
                        this.props.setCookieRequest(res.currToken)
                        let currFetch = '/user/profile/' + res.username.toString();
                        this.props.history.push(currFetch);
                    })
                } else{
                    (res.json()).then(res => {
                        if(res.response.name === 'MongoError'){
                            if(res.response.errmsg.split(':')[2] === " email_1 dup key"){
                                this.setState({signupMessage : 'An account with this email already exists.\n Please try a different email or login.'})
                            } else if(res.response.errmsg.split(':')[2] === " username_1 dup key"){
                                this.setState({signupMessage : 'Username already taken. Try a different one.'})
                            }
                        } else if(res.response.name === 'ValidationError'){
                            if(res.response.message === 'User validation failed: password: Password must be at least 6 characters'){
                                this.setState({signupMessage : 'Password must be at least 6 characters'})
                            } else {
                                this.setState({signupMessage : 'Must provide all required credentials.'})
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
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest} />
                <div className='signupContainer'>
                    <div id='signupCreds' className='container'>
                        <form>
                            <Email updateEmail={(event) => this.updateEmail(event)} />
                            <Username updateUsername={(event) => this.updateUsername(event)}/>
                            <Password updatePassword={(event) => this.updatePassword(event)}/>
                            {/* <Recaptcha
                                sitekey="6LeMZvUUAAAAAKUseOsUurdPLbhBu10byJagRND7"
                                render="explicit"
                                onloadCallback={() => {}}
                                verifyCallback={() => {this.setState({botAuthenticated : true})}}
                            /> */}
                            <br />
                            <CreateUser submitUser={(event) => this.submitUser(event)}/>
                            <br />
                        </form>
                        <Message signupMessage={this.state.signupMessage} />
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
            <p>Note: For simple access, you do not need to provide a real email.</p> 
            <p>However, you will be unable to reset your password through 'forgot password'.</p>
            <br/>
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
        <p className='signupMessage'>{props.signupMessage}</p>
    )
}

export default CreateProfile