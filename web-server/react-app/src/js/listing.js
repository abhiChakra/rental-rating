import React from 'react'
import Navbar from './navbar';
import '../css/listing.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
require('dotenv').config();

class Listing extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            addReviewLink: '/login',
            message : '',
            address : null,
            city : null,
            province: null,
            country: null,
            contributor : null,
            reviews: [],
            userReviews: [],
            otherReviews: [],
            authenticated: false,
            currUser: null
        }
    }

    fetchListingReviews(listingID){
        this.setState({userReviews : []})

        let currFetch = 'http://'+process.env.REACT_APP_IP+':5000/' + listingID + '/' + 'get_reviews';

        fetch(currFetch, {
                            'method' : 'GET',
                            'mode': 'cors',
                            headers: {
                                'Accept' : 'application/json'
                            }
                         }
        ).then(res => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({reviews : res.response}, function() {
                        let userReviews = []
                        let otherReviews = []
                        this.state.reviews.map(review => {
                            if(this.state.authenticated){
                                if(review.contributor == this.state.currUser){
                                    userReviews.push(review)
                                } else{
                                   otherReviews.push(review)
                                }
                            } else{
                                otherReviews.push(review)
                            }
                        })

                        this.setState({ userReviews : userReviews, otherReviews : otherReviews})
                    })
                })
            } else{
                (res.json()).then(res => {
                    this.setState({message : res.response})
                })
            }
        }).catch(e => {
            console.log(e)
        })
    }

    componentDidMount(){
        const  { id } = this.props.match.params;

        let currFetch = 'http://'+process.env.REACT_APP_IP+':5000/get_listing/' + id.toString();
        fetch(currFetch, {
                            method: 'GET', 
                            mode: 'cors',
                            headers: {
                                'Accept' : 'application/json'
                                    }
                        }
        ).then((res) => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({address : res.response.number + ' ' + res.response.street, city : res.response.city, province : res.response.province, 
                    country : res.response.country, contributor : res.response.contributor, listingID : res.response._id}, function() {this.checkAuthenticated()})
                })
            } else{
                (res.json()).then(res => {
                    this.setState({message : res.response}, function() {this.checkAuthenticated()})
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    checkAuthenticated(){
        const  { id } = this.props.match.params;

        fetch('http://'+process.env.REACT_APP_IP+':5000/user/is_authenticated', {
                                                            method: 'POST', 
                                                            mode: 'cors',
                                                            headers:{
                                                                'Content-Type' : 'application/json',
                                                                'Accept' : 'application/json'
                                                            },
                                                            body: JSON.stringify({'currUserToken': this.props.token}),
                                                            credentials : 'include'
                                                            }
        ).then(res => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({ authenticated: true, currUser: res.response.username, addReviewLink : '/' + this.state.listingID + '/add_review'}, 
                    function() {this.fetchListingReviews(id)})
                })
            } else{
                    this.setState({ authenticated: false, currUser: null, addReviewLink : '/login'}, 
                    function() {this.fetchListingReviews(id)})
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    AddReviewRedirect(event){
        event.preventDefault();

        this.props.history.push(this.state.addReviewLink);
    }

    deleteListing(event){
        event.preventDefault();

        confirmAlert({
            title: 'Confirm listing delete',
            message: 'Are you sure you want to delete this listing? Deleting will also remove all listing reviews.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const  { id } = this.props.match.params;

                    let currFetch = 'http://'+process.env.REACT_APP_IP+':5000/delete_listing/' + id;
                    fetch(currFetch,                            {
                                                                    method: 'DELETE',
                                                                    mode: 'cors',
                                                                    headers: {
                                                                        'Content-Type' : 'application/json',
                                                                        'Accept' : 'application/json'
                                                                    },
                                                                    body: JSON.stringify({'currUserToken' : this.props.token}),
                                                                    credentials: 'include'        
                                                                }
                    ).then(res => {
                        if(res.status == 200){
                            this.props.history.push('/user/profile/' + this.state.currUser)
                        } else{
                            alert('Error deleting listing')
                        }
                    }).catch((error) => {
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

    updateReview(reviewID){
        const  listingID = this.props.match.params.id;

        this.props.history.push('/' + reviewID + '/' + listingID +'/update_review');
    }

    deleteReview(reviewID){
        const  { id } = this.props.match.params;

        let currFetch = 'http://'+process.env.REACT_APP_IP+':5000/delete_review/' + reviewID;
        fetch(currFetch, {
                            method: 'DELETE',
                            mode: 'cors',
                            headers: {
                                'Content-Type' : 'application/json',
                                'Accept' : 'application/json'
                            },
                            body: JSON.stringify({'currUserToken' : this.props.token}),
                            credentials: 'include'
                            }
        ).then(res => {
            if(res.status == 200){
                this.fetchListingReviews(id);
            }
        }).catch(error => {
            console.log(error)
        })
    }

    render(){
        return(
            <div>
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                <h2 className='listingHeader'>{this.state.address}, {this.state.city},  
                 {this.state.province}, {this.state.country}</h2>
                <p className='contributor'>Contributor: {this.state.contributor}</p>
                <div>
                    {(this.state.authenticated && this.state.contributor == this.state.currUser) ? 
                    <button type="button" className='btn btn-danger btn-lg deleteListingButton' onClick={(event) => this.deleteListing(event)}>Delete Listing</button>
                    :
                    null
                    }
                </div>
                <h2 className='listingReviewsTitle'>Listing reviews</h2>


                <div>
                        <h5 className='yourReview'>Your review: </h5> 
                        <YourReviews 
                        userReviews={this.state.userReviews}
                        deleteReview={(reviewID) => this.deleteReview.bind(this, reviewID)}
                        updateReview={(reviewID) => this.updateReview.bind(this, reviewID)}
                        AddReviewRedirect={(event) => {this.AddReviewRedirect(event)}}/>
                </div>

                <div>
                    <h5 className='otherReviews'>Other reviews: </h5>
                    <OtherReviews 
                    otherReviews={this.state.otherReviews}/>
                </div>
                <br/>
                <br />
            </div>
        )
    }
}

function YourReviews(props){
    if(props.userReviews.length > 0){
        return props.userReviews.map(review => {
                return(
                    <div className='listingReview'>
                        <div className='reviewtitleDiv'>
                            <h5 className='reviewTitle'>{review.title}</h5>
                        </div>
                        <div className='reviewDetailsWrapper'>
                            <div className='reviewSpecs'>
                                <li className='reviewContributor'>  Overall Rating: {review.overall_rating}/5   |   Bug Rating: {review.bug_rating}/5  
                                  |  Admin Rating: {review.admin_rating}/5   |   Location Rating: {review.location_rating}/5 </li>
                            </div>
                            <div className='reviewCommentsDiv'>
                                <p className='reviewComments'>{review.comments}</p>
                            </div>
                        </div>
                        <div className='reviewButtons'>
                            <button type="button" className='btn btn-outline-danger deleteReviewButton' onClick={props.deleteReview(review._id)}>Delete Review</button>
                            <button type="button" className='btn btn-outline-success updateReviewButton' onClick={props.updateReview(review._id)}>Update Review</button>
                        </div>
                    </div>
                )
        })
    } else{
        return(
            <div className='addReviewDiv'>
                    <button type="button" className='btn btn-primary btn-lg addReviewButton' onClick={props.AddReviewRedirect}>+ Add Review</button>
            </div>
        )
    }
}

function OtherReviews(props){
    if(props.otherReviews.length > 0){
        return props.otherReviews.map(review => {
            return(
                <div className='listingReview'>
                    <div className='reviewtitleDiv'>
                        <h5 className='reviewTitle'>{review.title}</h5>
                    </div>
                    <div className='reviewDetailsWrapper'>
                        <div className='reviewSpecs'>
                            <li >Contributor: {review.contributor}</li>
                            <li>  Overall Rating: {review.overall_rating}/5   |   Bug Rating: {review.bug_rating}/5  
                                  |  Admin Rating: {review.admin_rating}/5   |   Location Rating: {review.location_rating}/5 </li>
                        </div>
                        <div className='reviewCommentsDiv'>
                            <p className='reviewComments'>{review.comments}</p>
                        </div>
                    </div>
                </div>
            )    
        })
    } else{
        return(
            <div className='noOtherReviews'>No reviews found</div>
        )
    }
}

export default Listing;