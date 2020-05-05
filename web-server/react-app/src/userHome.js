import React from 'react';
import { Link } from 'react-router-dom';

class UserHome extends React.Component {
    constructor(props){
        super(props)
        this.state = {
                    userMessage : "Default message", 
                    authenticated : false,
                    userListings : []
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

    fetchUserListings(){
        fetch('http://127.0.0.1:5000/get_listings', {
                                                    method : 'GET',
                                                    mode: 'cors',
                                                    headers: {
                                                        'Accept' : 'application/json',
                                                    }, 
                                                    credentials: 'include'
                                                    }
        ).then((res) => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({userListings : res.response})
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
        this.fetchUsermessage();
        this.fetchUserListings();
    }

    render(){
        return(
            <div>
                <MessageDisplay userMessage={this.state.userMessage} fetchUsermessage={() => this.fetchUsermessage()}/> <br/>
                <LogoutButton authenticated={this.state.authenticated} logoutAction={(event) => this.logoutAction(event)} /> <br />
                <CreateListing authenticated={this.state.authenticated} /> <br />

                <h4>Your listings: </h4>
                <UserListings userListings={this.state.userListings}/>
            </div>
        )
    }
}

function UserListings(props){
    return props.userListings.map(listing => {
        let pathname = '/listing/' + listing._id 
        return(
            <div> 
               <Link to={{
                   pathname: pathname
               }}>Address: {listing.number} {listing.street}, 
               {listing.city}, {listing.province}, {listing.country}</Link>
               <br/>
            </div>
        )
    })
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

function CreateListing(props){
    if(props.authenticated){
        return(
            <Link to='/user/create_listing'>Create new Listing</Link>
        )
    } else{
        return(
            null
        )
    }
}

export default UserHome;