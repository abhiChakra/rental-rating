import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
// Using confirmAlert npm module for confirming deletion of user's profile
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../css/userHome.css'
// import { useCookies } from 'react-cookie';
// const [cookies] = useCookies(['token']);

// main user home page
class UserHome extends React.Component {
    constructor(props){
        super(props)
        this.state = {
                    currUser: props.match.params.username,
                    userMessage : "Default message",
                    userReviews: [],
                    userListings : [],
                    authenticated : false,
                }
    }

    // HTTP request to fetch user's created listings for display
    fetchUserListings(){
        let currCookieToken = this.props.token;
        fetch('/api/get_listings', {
                                                    method : 'POST',
                                                    mode: 'cors',
                                                    headers: {
                                                        'Content-Type' : 'application/json',
                                                        'Accept' : 'application/json',
                                                    }, 
                                                    body: JSON.stringify({'currUserToken' : currCookieToken}),
                                                    credentials: 'include'
                                                    }
        ).then((res) => {
            if(res.status === 200){
                (res.json()).then(res => {
                    this.setState({userListings : res.response})
                })
            } else{
                (res.json()).then(res => {
                   console.log(res.response)
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // HTTP request to handle deleting the user's profile
    deleteUserProfile(event){
        let currCookieToken = this.props.token;
        event.preventDefault();

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete your profile? This will delete all your listings and reviews. ',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    fetch('/api/user/delete_user', {
                                                                    method: 'DELETE',
                                                                    mode: 'cors',
                                                                    headers:{
                                                                        'Content-Type' : 'application/json',
                                                                        'Accept' : 'application/json'
                                                                    },
                                                                    body: JSON.stringify({'currUserToken' : currCookieToken}),
                                                                    credentials : 'include'
                                                                    }
                        ).then(res => {
                                if(res.status === 200){
                                    this.props.removeCookieRequest()
                                    setTimeout(() => {
                                        this.props.history.push('/');
                                    }, 1000)
                                } else{
                                    (res.json()).then(res => {
                                        alert('Could not delete profile')
                                        console.log(res.response)
                                    })
                                }
                        }).catch(error => {
                            console.log(error)
                        })
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
    }

    // HTTP request for ensuring user's authenticated, otherwise redirecting to login
    componentDidMount(){
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
                                    this.fetchUserListings();
                                    this.setState({userMessage : 'Welcome back ' + res.response.username, authenticated : true})
                                    })
                            } else{
                                    this.props.history.push('/login')
                                }
                        }).catch((error) => {
                                console.log(error)
                        })
        }

    render(){
        return(
            <div>
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                <MessageDisplay userMessage={this.state.userMessage}/> <br/>
                <CreateListing authenticated={this.state.authenticated} /> 
                <br />
                <h4 className='yourListings'>Your listings: </h4>
                <UserListings userListings={this.state.userListings}/>
                <br/>
                <br/>
                <DeleteUser deleteUserProfile={(event) => {this.deleteUserProfile(event)}}/>
            </div>
        )
    }
}

// function UserReviews(props){
//     return props.userReviews.map(review => {
//         let pathname = '/listing'
//     })
// }

function UserListings(props){
    if(props.userListings.length > 0){
        return props.userListings.map(listing => {
            let pathname = '/listing/' + listing._id 
            return(
                <div className='queryItem'> 
                   <Link className='addressLink' to={{
                       pathname: pathname
                   }}>Address: {listing.number} {listing.street},  
                   {listing.city}, {listing.province}, {listing.country}</Link>
                </div>
            )
        })
    } else{
        return(
            <div className='noListing'>
                You do not have any listings.
            </div>
        )
    }
    
}

function MessageDisplay(props){
    return(
        <p className='userMessage'>{props.userMessage}</p>
    )
}

function CreateListing(props){
    if(props.authenticated){
        return(
            <Link className='createListing' to='/user/create_listing'>+ Create new Listing</Link>
        )
    } else{
        return(
            null
        )
    }
}

function DeleteUser(props){
    return(
        <button type="button" className="btn btn-danger btn-lg deleteUserButton" onClick={props.deleteUserProfile}>- Delete User Profile</button>
    )
}

export default UserHome;