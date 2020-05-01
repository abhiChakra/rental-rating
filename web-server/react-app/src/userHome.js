import React from 'react';

class UserHome extends React.Component {
    constructor(props){
        super(props)
        this.state = {
                    userMessage : "Default message", 
                    authenticated : false
                    }
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
                (res.json()).then((res) => {
                    this.setState({authenticated : false, userMessage : res.response})
                })
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


    fetchUsermessage(){
        let currUsername = this.props.match.params.username;
        let messageFetchUrl = 'http://127.0.0.1:5000/user/profile/' + currUsername.toString();
        fetch(messageFetchUrl, {method: 'GET',
                                              mode: 'cors',
                                              headers : { 
                                                'Accept': 'application/json'
                                               },
                                              credentials: 'include'
                                             }
            ).then(res => {
                if(res.status === 200){
                    (res.json()).then(res => {
                        console.log(res)
                        this.setState({userMessage : res.response, authenticated : true})
                    })
                } else{
                    (res.json()).then(res => {
                        this.setState({userMessage : res.response})
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    componentDidMount(){
        this.fetchUsermessage()
    }

    render(){
        return(
            <div>
                <MessageDisplay userMessage={this.state.userMessage} fetchUsermessage={() => this.fetchUsermessage()}/>
                <LogoutButton authenticated={this.state.authenticated} logoutAction={(event) => this.logoutAction(event)} />
            </div>
        )
    }
}

function MessageDisplay(props){
    return(
        <p>{props.userMessage}</p>
    )
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

export default UserHome;