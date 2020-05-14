import React from 'react'
import Navbar from './navbar';
import '../css/forgotPass.css'

class ForgotPassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userEmail : null,
            pwdResetMessage: '',
            showEmailField: true
        }
    }

    handleEmailChange(event){
        this.setState({userEmail : event.target.value})
    }

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

    handleSubmit(event){
        event.preventDefault();
        fetch('http://'+process.env.REACT_APP_IP+':5000/forgot', {
                                                                method: 'POST',
                                                                mode: 'cors',
                                                                headers: {
                                                                    'Content-Type' : 'application/json',
                                                                    'Accept' : 'application/json'
                                                                }, 
                                                                body: JSON.stringify({'email' : this.state.userEmail})
                                                                }
        ).then(res => {
            if(res.status == 200){
                this.setState({pwdResetMessage : 'An email has been sent to the provided email.', showEmailField : false})
            } else if(res.status == 404){
                this.setState({pwdResetMessage : 'Please provide a valid email address.'})
            }
        }).catch(e => {
            console.log(e)
        })
    }

    render(){
        return(
            <div>
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                <p className='enterEmail'>Please enter the valid email associated with your account below.</p>
                <EmailInput showEmailField={this.state.showEmailField} handleEmailChange={(event) => this.handleEmailChange(event)}/>
                {this.state.showEmailField ? 
                    <button type="button" className='btn btn-primary submitForgotPwd' onClick={(event) => this.handleSubmit(event)}>Submit</button>
                    :
                   null
                }
                <br/>
                <p className='forgotPwdMessage'>{this.state.pwdResetMessage}</p>
            </div>
        )     
    }
}

function EmailInput(props){
    if(props.showEmailField){
        return(
            <div className="form-group userEmail">
                <input type="email" className="form-control" placeholder='user@example.com' onChange={props.handleEmailChange}></input>
            </div>
        )
    } else{
        return(
            null
        )
    }
}

export default ForgotPassword;