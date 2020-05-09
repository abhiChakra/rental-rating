import React from 'react'
import { throws } from 'assert';

class CreateReview extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            listingID : this.props.match.params.listingID,
            listingAddress: null,
            overallRating: null,
            bugRating: null,
            adminRating: null,
            locationRating: null,
            reviewTitle: null,
            reviewComments: null,
            message: ''
        }
    }

    componentDidMount(){
        let currFetch = 'http://127.0.0.1:5000/get_listing/' + this.state.listingID;
        fetch(currFetch, {
                            method: 'GET',
                            mode: 'cors',
                            headers: {
                                'Accept' : 'application/json'
                            },
                            credentials: 'include'
                        }
        ).then(res => {
            (res.json()).then(res => {
                this.setState({ listingAddress : res.response.number + ' ' + res.response.street + 
                                                + ', ' + res.response.city + ', ' + res.response.province +
                                            res.response.country})
            })
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

        let currFetch = 'http://127.0.0.1:5000/' + this.state.listingID + '/add_review';

        let reviewBody = {
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
               this.setState({message : res.response})
           }
        }).catch(e => {
            console.log(e);
        })
    }

    render(){
        return(
            <div>
                <h5>Create your review for {this.state.listingAddress}</h5>
                <RatingTitle handleReviewTitle={(event) => this.handleReviewTitle(event)}/>
                <Overall handleOverallRating={(event) => this.handleOverallRating(event)}/>
                <BugRating handleBugRating={(event) => this.handleBugRating(event)} />
                <AdminRating handleAdminRating={(event)=>this.handleAdminRating(event)}/>
                <LocationRating handleLocationRating={(event) => this.handleLocationRating(event)}/>
                <Comments handleReviewComments={(event)=>{this.handleReviewComments(event)}}/>
                <SubmitReview handleReviewSubmit={(event) => {this.handleReviewSubmit(event)}}/>

                <p>{this.state.message}</p>
            </div>
        )
    }
}

function Overall(props){
    return(
        <div>
            <p>Overall rating out of 5 where 5 is fantastic and 1 is abysmal</p>
            <input id='overallRatingInput' type='text' onChange={props.handleOverallRating} placeholder='rating'></input>
        </div>
    )
}

function BugRating(props){
    return(
        <div>
            <p>Bug rating out of 5, where 5 is absolutely no bug problems and 1 is infested.</p>
            <input id='bugRating' type='text' onChange={props.handleBugRating} placeholder='rating'></input>
        </div>
    )
}

function AdminRating(props){
    return(
        <div>
            <p>Building admin/landlord/subletter rating out of 5, where 5 is fantastic and 1 is awful.</p>
            <input id='adminRating' type='text' onChange={props.handleAdminRating} placeholder='rating'></input>
        </div>
    )
}

function LocationRating(props){
    return(
        <div>
            <p>Building location/transit rating out of 5, where 5 is fantastic and 1 is awful.</p>
            <input id='locationRating' type='text' onChange={props.handleLocationRating} placeholder='rating'></input>
        </div>
    )
}

function RatingTitle(props){
    return(
        <div>
            <p>Title (main point) of your review.</p>
            <input id='reviewTitle' type='text' onChange={props.handleReviewTitle} placeholder='An awesome rent.../An awful rent...'></input>
        </div>
    )
}

function Comments(props){
    return(
        <div>
            <p>Other comments about this building which may be helpful for others.</p>
            <input id='reviewComments' type='text' onChange={props.handleReviewComments} placeholder='The rentl could improve on...'></input>
        </div>
    )
}

function SubmitReview(props){
    return(
        <div>
            <button onClick={props.handleReviewSubmit}>Submit</button>
        </div>
    )
}



export default CreateReview;