import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import '../css/userHome.css'

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

    fetchUserReviews(){
        fetch('http://127.0.0.1:5000/get_reviews', {
                                                    method: 'GET',
                                                    mode: 'cors',
                                                    headers: {
                                                        'Accept' : 'application/json'
                                                    },
                                                    credentials: 'include'
                                                    }
        ).then(res => {
            if(res.status == 200){

            } else{

            }
        }).catch(error => {
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
                <Navbar />
                <MessageDisplay userMessage={this.state.userMessage} fetchUsermessage={() => this.fetchUsermessage()}/> <br/>
                <CreateListing authenticated={this.state.authenticated} /> 
                <br />
                <h4 className='yourListings'>Your listings: </h4>
                <UserListings userListings={this.state.userListings}/>
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

export default UserHome;