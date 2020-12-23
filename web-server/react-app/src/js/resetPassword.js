import React from 'react'
import Navbar from './navbar';
import '../css/resetPassword.css';

// reset password page
class ResetPassword extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newPassword : null,
            confirmNewPassword : null, 
            newPwdResetMessage: ''
        }
    }

    handlePasswordChange(event){
        this.setState({newPassword : event.target.value})
    }

    handlePasswordConfirm(event){
        this.setState({confirmNewPassword : event.target.value})
    }

    // HTTP request to handle a pwd reset
    handlePasswordReset(event){
        event.preventDefault();

        if(this.state.newPassword !== this.state.confirmNewPassword || this.state.newPassword == null){
            this.setState({newPwdResetMessage : 'Password fields do not match. Try again.'})
        } else{
            fetch('http://'+process.env.REACT_APP_IP+':5000/'+this.props.match.params.token+'/reset', {
                                                                                                    method: 'POST',
                                                                                                    mode: 'cors',
                                                                                                    headers: {
                                                                                                        'Content-Type' : 'application/json',
                                                                                                        'Accept' : 'application/json'
                                                                                                    }, 
                                                                                                    body: JSON.stringify({'newPassword' : this.state.newPassword})
                                                                                                }
                ).then(res => {
                    if(res.status === 200){
                        alert("Your password has been reset.")
                        this.props.history.push('/login')
                    } else{
                        (res.json()).then(res => {
                            this.setState({newPwdResetMessage : res.response})
                        })
                    }
                }).catch(e => {
                    console.log(e)
                })
        }
    }

    render(){
        return(
            <div>
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                <p className='resetPwdInfo'>Please enter your new password below. Password must be at least 6 characters long.</p>
                <div className="form-group passwordField">
                    <input type="password" className='newPassword' className="form-control" placeholder='password' onChange={(event) => this.handlePasswordChange(event)}></input>
                </div>
                <div className="form-group passwordField">
                    <input type="password" className='newPassword' className="form-control" placeholder='Confirm password' onChange={(event) => this.handlePasswordConfirm(event)}></input>
                </div>
                <br />
                <button type="button" className='btn btn-primary resetPwdButton' onClick={(event) => this.handlePasswordReset(event)}>Submit</button>
                <p className='resetPwdMsg'>{this.state.newPwdResetMessage}</p>
            </div>
        )
    }
}

export default ResetPassword;