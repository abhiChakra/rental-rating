import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import PlacesAutocomplete from 'react-places-autocomplete'
import '../css/home.css'
require('dotenv').config();

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            'address' : '',
            'number' : null,
            'street' : null,
            'city' : null,
            'province' : null,
            'country' : null,
            queryRes : [],
            message : ''
        }
    }

    handleChange = address => {
        this.setState({ address : address, message : '' });
    };

    handleSelect = address => {

        let split_address = address.split(',')
        let street_address = split_address[0]
        let split_street_add = street_address.split(' ')

        let houseNum = split_street_add[0].trim()
        let street = split_street_add[1].trim() + ' ' + split_street_add[2].trim()

        let city = split_address[1].trim()
        let province = split_address[2].trim()
        let country = split_address[3].trim()

        this.setState({ number : houseNum})
        this.setState({ street : street})
        this.setState({ city : city})
        this.setState({ province : province})
        this.setState({ country : country})
    };

    handleSubmit(event){
        event.preventDefault();

        let currFetch = 'http://'+process.env.REACT_APP_IP+':5000/get_listing_query?' + 
        'number=' + this.state.number + '&street=' + this.state.street +
        '&city=' + this.state.city + '&province=' + this.state.province + 
        '&country=' + this.state.country 

        fetch(currFetch, {
                          method: 'GET', 
                          mode: 'cors', 
                          headers: {
                              'Accept' : 'application/json'
                          }
                         }
        ).then(res => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({ queryRes : res.response})
                })
            } else{
                (res.json()).then(res => {
                    this.setState({queryRes : null, message : res.response})
                })
            }
        }).catch(error => {
            console.log(error)
            this.setState({queryRes : null, message : 'Error getting query'})
        })
    }

    handleOnOver = address => {
        this.handleChange(address)
        document.getElementById('searchInput').value = address
    }

    render(){
        return(
                <div>
                    <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}

                        className='autocomplete'
                    >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <div className='titleBar'>
                                <h2>Search Your Rental </h2>
                                <a href='https://www.youtube.com/watch?v=MDknWBXezBc'>Watch a quick walkthrough of using Rate A Rental on YouTube!</a>
                            </div>
                            <br/>
                            <div className='searchBar'>
                                <div className='searchInput'>
                                <input 
                               aria-label = "Recipient's username"
                               aria-describedby = "basic-addon2"
                                {...getInputProps({
                                    placeholder: '81 St Mary St, Toronto, ON, Canada',
                                    className: 'location-search-input form-control',
                                    id: 'searchInput',
                                    type: "text"
                                })} />
                                </div>
                                <div className='homeSearchButton'>
                                    <button className="btn btn-primary btn-lg" type="button" onClick={(event) => this.handleSubmit(event)}>Search</button> 
                                </div>
                                <br/>
                                <br/>
                            </div>
                            <br/>
                            <div className='suggestions'>
                            {loading ? <div>...loading </div> : null}

                            {suggestions.map((suggestion) => {
                                return(
                                    <div onClick={() => this.handleSelect(suggestion.description)}
                                    onMouseOver={() => this.handleOnOver(suggestion.description)} 
                                    className='suggestion' {...getSuggestionItemProps(suggestion)}>
                                        {suggestion.description}
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                            )}
                    </PlacesAutocomplete> <br />

                    <QueryListings message={this.state.message} queryListings={this.state.queryRes}/>
                    <br/>
                </div>
            )
        }
}

function QueryListings(props){
    if(props.queryListings){
        return props.queryListings.map(listing => {
            let pathname = '/listing/' + listing._id 
            return(
                <div className='queryItem'>
                   <Link className='addressLink' to={{
                       pathname: pathname
                   }}>Address: {listing.number} {listing.street}, 
                   {listing.city}, {listing.province}, {listing.country}</Link>
                   <br/>
                </div>
            )
        })
    } else{
        return(
            <div className='displayMessage'>
                {props.message}
            </div>
        )
    }
}

export default Home