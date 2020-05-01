import React from 'react';
import { Link } from 'react-router-dom';


class CreateProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: null, 
            username: null,
            password: null
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
                    let currFetch = 'user/profile/' + res.username.toString();
                    this.props.history.push(currFetch);
                })
            }
        })
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
                    console.log("Could not create user")
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    render(){
        return(
            <div>
                <Link to='/'>Home</Link>

                <p>Signup page</p>

                <Email updateEmail={(event) => this.updateEmail(event)} />

                <br/>

                <Username updateUsername={(event) => this.updateUsername(event)}/>

                <br/>

                <Password updatePassword={(event) => this.updatePassword(event)}/>

                <br/>

                <CreateUser submitUser={(event) => this.submitUser(event)}/>

            </div>
        )
        
    }
}

function Username(props){
    return(
        <input onChange={props.updateUsername} placeholder='username'></input>
    )
}

function Email(props){
    return(
        <input onChange={props.updateEmail} placeholder='email'></input>
    )
}

function Password(props){
    return(
        <input type='password' onChange={props.updatePassword} placeholder='password'></input>
    )
}

function CreateUser(props){
    return(
        <button onClick={props.submitUser}>Create</button>
    )
}

export default CreateProfile