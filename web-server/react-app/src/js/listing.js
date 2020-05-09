import React from 'react'
import Navbar from './navbar';

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
            authenticated: false,
            currUser: null
        }
    }

    fetchListingReviews(listingID){
        let currFetch = 'http://127.0.0.1:5000/' + listingID + '/' + 'get_reviews';

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
                    this.setState({reviews : res.response})
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

        let currFetch = 'http://127.0.0.1:5000/get_listing/' + id.toString();
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
                    console.log(res.response._id)
                    this.setState({address : res.response.number + ' ' + res.response.street, city : res.response.city, province : res.response.province,
                    country : res.response.country, contributor : res.response.contributor, listingID : res.response._id})
                })
            } else{
                (res.json()).then(res => {
                    this.setState({message : res.response})
                })
            }
        }).catch(error => {
            console.log(error)
        })

        this.fetchListingReviews(id);
        this.checkAuthenticated();
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
                    this.setState({ authenticated: true, currUser: res.response.username, addReviewLink : '/' + this.state.listingID + '/add_review'})
                })
            } else{
                    this.setState({ authenticated: false, currUser: null, addReviewLink : '/login'})
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
        console.log("deleting listing")
        event.preventDefault();

        const  { id } = this.props.match.params;

        let currFetch = 'http://127.0.0.1:5000/delete_listing/' + id;
        fetch(currFetch,                            {
                                                        method: 'DELETE',
                                                        mode: 'cors',
                                                        headers: {
                                                            'Accept' : 'application/json'
                                                        },
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

    deleteReview(reviewID){
        const  { id } = this.props.match.params;

        console.log('deleting review')
        console.log(reviewID)

        let currFetch = 'http://127.0.0.1:5000/delete_review/' + reviewID;
        fetch(currFetch, {
                            method: 'DELETE',
                            mode: 'cors',
                            headers: {
                                'Accept' : 'application/json'
                            },
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
                <Navbar />
                <h2 className='listingHeader'>{this.state.address} + {this.state.city} + 
                {this.state.province} + {this.state.country}</h2>
                <br/>
                <p className='contributor'>Contributor: {this.state.contributor}</p>
                <br/>
                <div>
                    {(this.state.authenticated && this.state.contributor == this.state.currUser) ? 
                    <button onClick={(event) => this.deleteListing(event)}>Delete Listing</button>
                    :
                    null
                    }
                </div>
                <br/>
                <div className='addReviewDiv'>
                    <button className='addReviewButton' onClick={(event) => this.AddReviewRedirect(event)}>Add Review</button>
                </div>
                <br/>
                <h2 className='listingReviews'>Listing reviews</h2>

                {this.state.authenticated ?
                    <div>
                        <h5>Your reviews: </h5> 
                        <YourReviews authenticated={this.state.authenticated} 
                        currUser={this.state.currUser}
                        reviews={this.state.reviews}
                        deleteReview={(reviewID) => this.deleteReview.bind(this, reviewID)}/>
                    </div>
                    : 
                    null
                }

                <div>
                    <h5>Other reviews: </h5>
                    <OtherReviews 
                    authenticated={this.state.authenticated} 
                    currUser={this.state.currUser}
                    reviews={this.state.reviews}/>
                </div>

                <p>{this.state.message}</p>
            </div>
        )
    }
}

function YourReviews(props){
    if(props.authenticated){
        return props.reviews.map(review => {
            if(review.contributor == props.currUser){
                return(
                    <div className='listingReview'>
                        <h5>{review.title}</h5>
                        <li className='reviewContributor'>Contributor: {review.contributor}</li>
                        <li className='overallRating'>Overall Rating: {review.overall_rating}</li>
                        <li className='bugRating'>Bug Rating: {review.bug_rating}</li>
                        <li className='adminRating'>Admin Rating: {review.admin_rating}</li>
                        <li className='locationRating'>Location Rating: {review.location_rating}</li>
                        <p className='reviewComments'>{review.comments}</p>
                        <button className='deleteReviewButton' onClick={props.deleteReview(review._id)}>Delete Review</button>
                    </div>
                )
            }
        })
    } else{
        return(
            <p>You have not provided any reviews for this listing.</p>
        )
    }
}

function OtherReviews(props){
    if(props.reviews){
        return props.reviews.map(review => {
            if(props.authenticated){
                if(review.contributor == props.currUser){
                    return(
                        null
                    )
                } else{
                    return(
                        <div className='listingReview'>
                            <h5>{review.title}</h5>
                            <li className='reviewContributor'>Contributor: {review.contributor}</li>
                            <li className='overallRating'>Overall Rating: {review.overall_rating}</li>
                            <li className='bugRating'>Bug Rating: {review.bug_rating}</li>
                            <li className='adminRating'>Admin Rating: {review.admin_rating}</li>
                            <li className='locationRating'>Location Rating: {review.location_rating}</li>
                            <p className='reviewComments'>{review.comments}</p>
                        </div>
                    )    
                }
            } else{
                return(
                    <div className='listingReview'>
                        <h5>{review.title}</h5>
                        <li className='reviewContributor'>Contributor: {review.contributor}</li>
                        <li className='overallRating'>Overall Rating: {review.overall_rating}</li>
                        <li className='bugRating'>Bug Rating: {review.bug_rating}</li>
                        <li className='adminRating'>Admin Rating: {review.admin_rating}</li>
                        <li className='locationRating'>Location Rating: {review.location_rating}</li>
                        <p className='reviewComments'>{review.comments}</p>
                    </div>
                )    
            }
        }) 
    } else{
        return(
            <div>No reviews found</div>
        )
    }
}

export default Listing;