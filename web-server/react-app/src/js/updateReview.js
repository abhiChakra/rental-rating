import React from 'react'
import Navbar from './navbar';
import '../css/updateReview.css';

class UpdateReview extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            reviewID : this.props.match.params.reviewID,
            listingID: this.props.match.params.listingID,
            listingAddress: null,
            overallRating: null,
            bugRating: null,
            adminRating: null,
            locationRating: null,
            reviewTitle: null,
            reviewComments: null,
            createReviewMessage: ''
        }
    }

    componentDidMount(){
        let reviewFetch = 'http://'+process.env.REACT_APP_IP+':5000/' + this.state.reviewID + '/get_review';
        fetch(reviewFetch, {
                            method: 'POST',
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
                (res.json()).then(res => {

                    this.setState({ overallRating : res.response.overall_rating,
                        bugRating : res.response.bug_rating,
                        adminRating : res.response.admin_rating,
                        locationRating : res.response.location_rating,
                        reviewTitle: res.response.title,
                        reviewComments: res.response.comments})
    
                        document.getElementById('overallRatingInput').value = res.response.overall_rating
                        document.getElementById('bugRating').value = res.response.bug_rating
                        document.getElementById('adminRating').value = res.response.admin_rating
                        document.getElementById('locationRating').value = res.response.location_rating
                        document.getElementById('reviewTitle').value = res.response.title
                        document.getElementById('reviewComments').value = res.response.comments
                    })
            }else{
                (res.json()).then(res => {
                    this.setState({createReviewMessage : res.response})
                })
            }
            
        }).catch(e => {
            console.log(e)
        })


        let listingFetch = 'http://'+process.env.REACT_APP_IP+':5000/get_listing/' + this.state.listingID;
        fetch(listingFetch, {
                            method: 'GET',
                            mode: 'cors',
                            headers: {
                                'Accept' : 'application/json'
                            },
                            credentials: 'include'
                        }
        ).then(res => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({ listingAddress : res.response.number + ' ' + res.response.street + 
                                                    ', ' + res.response.city + ', ' + res.response.province + ', ' +
                                                res.response.country})
                })
            } else{
                (res.json()).then(res => {
                    this.setState({createReviewMessage : res.response})
                })
            }
        }).catch(e => {
            console.log(e)
        })
    }

    handleOverallRating(event){
        this.setState({ overallRating : event.target.value})
    }

    handleBugRating(event){
        this.setState({ bugRating : event.target.value})
    }

    handleAdminRating(event){
        this.setState({ adminRating : event.target.value})
    }

    handleLocationRating(event){
        this.setState({ locationRating : event.target.value})
    }

    handleReviewTitle(event){
        this.setState({ reviewTitle : event.target.value})
    }

    handleReviewComments(event){
        this.setState({ reviewComments : event.target.value})
    }

    handleReviewSubmit(event){
        event.preventDefault();

        let currFetch = 'http://'+process.env.REACT_APP_IP+':5000/' + this.state.reviewID + '/update_review';

        let reviewBody = {
            'currUserToken' : this.props.token,
            "overall_rating" : this.state.overallRating,
            "bug_rating" : this.state.bugRating,
            "admin_rating" : this.state.adminRating,
            "location_rating" : this.state.locationRating,
            "title" : this.state.reviewTitle,
            "comments" : this.state.reviewComments
        }

        fetch(currFetch, {
                            method : 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-type' : 'application/json',
                                'Accept' : 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify(reviewBody)
                            }
        ).then(res => {
           if(res.status == 200){
               this.props.history.push('/listing/' + this.state.listingID)
           } else{
               (res.json()).then(res => {
                    this.setState({createReviewMessage : res.response})
               })
           }
        }).catch(e => {
            console.log(e);
        })
    }

    render(){
        return(
            <div>
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                <h4 className='createReviewHeader'>Update your review for {this.state.listingAddress}</h4>
                <div className='createReviewFormDiv'>
                    <RatingTitle handleReviewTitle={(event) => this.handleReviewTitle(event)}/>
                    <Overall handleOverallRating={(event) => this.handleOverallRating(event)}/>
                    <BugRating handleBugRating={(event) => this.handleBugRating(event)} />
                    <AdminRating handleAdminRating={(event)=>this.handleAdminRating(event)}/>
                    <LocationRating handleLocationRating={(event) => this.handleLocationRating(event)}/>
                    <Comments handleReviewComments={(event)=>{this.handleReviewComments(event)}}/>
                    <SubmitReview handleReviewSubmit={(event) => {this.handleReviewSubmit(event)}}/>
                    <Message createReviewMessage={this.state.createReviewMessage}/>
                    <br/>
                </div>
            </div>
        )
    }
}

function Overall(props){
    return(
        <div className='createListingInputDiv'>
            <p>Overall rating out of 5 where 5 is fantastic and 1 is abysmal</p>
            <input className="form-control createListingInput" id='overallRatingInput' type='text' onChange={props.handleOverallRating} placeholder='rating'></input>
        </div>
    )
}

function BugRating(props){
    return(
        <div className='createListingInputDiv'>
            <p className='inputDes'>Bug rating out of 5, where 5 is absolutely no bug problems and 1 is infested.</p>
            <input className="form-control createListingInput" id='bugRating' type='text' onChange={props.handleBugRating} placeholder='rating'></input>
        </div>
    )
}

function AdminRating(props){
    return(
        <div className='createListingInputDiv'>
            <p className='inputDes'>Building admin/landlord/subletter rating out of 5, where 5 is fantastic and 1 is awful.</p>
            <input className="form-control createListingInput" id='adminRating' type='text' onChange={props.handleAdminRating} placeholder='rating'></input>
        </div>
    )
}

function LocationRating(props){
    return(
        <div className='createListingInputDiv'>
            <p className='inputDes'>Building location/transit rating out of 5, where 5 is fantastic and 1 is awful.</p>
            <input className="form-control createListingInput" id='locationRating' type='text' onChange={props.handleLocationRating} placeholder='rating'></input>
        </div>
    )
}

function RatingTitle(props){
    return(
        <div className='createListingInputDiv'>
            <p className='inputDes'>Title (main point) of your review.</p>
            <input className="form-control createListingInput" id='reviewTitle' type='text' onChange={props.handleReviewTitle} placeholder='An awesome rent.../An awful rent...'></input>
        </div>
    )
}

function Comments(props){
    return(
        <div className='createListingInputDiv'>
            <p className='inputDes'>Other comments about this building which may be helpful for others.</p>
            <input className="form-control createListingInput" id='reviewComments' type='text' onChange={props.handleReviewComments} placeholder='The rentl could improve on...'></input>
        </div>
    )
}

function SubmitReview(props){
    return(
        <div>
            <button class="btn btn-success btn-lg btn-block" onClick={props.handleReviewSubmit}>Save Review</button>
        </div>
    )
}

function Message(props){
    return(
        <div className='createReviewMessage'>
            {props.createReviewMessage}
        </div>
    )
}



export default UpdateReview;