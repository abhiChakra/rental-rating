import React from 'react'

// using this npm module for displaying results from Google Places API in dropdown
import PlacesAutocomplete from 'react-places-autocomplete'
import Navbar from './navbar'
import '../css/createListing.css'
require('dotenv').config();

// page for creating a listing
class CreateListing extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'address' : '',
            'number' : null,
            'street' : null,
            'city' : null,
            'province' : null,
            'country' : null, 
            'message' : '',
            'currUser' : null
        }
    }

    // check for user authentication
    checkAuthenticated(){
        fetch('http://'+process.env.REACT_APP_IP+':5000/user/is_authenticated', {
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
                    this.setState({currUser : res.response.username})
                })
            } else{
                this.props.history.push('/')
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    componentDidMount(){
       this.checkAuthenticated();
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleOnOver = address => {
        this.handleChange(address)
        document.getElementById('searchInput').value = address
    }

    // handling selection of an address from dropdown
    handleSelect = address => {

        let split_address = address.split(',')
        let street_address = split_address[0]
        let split_street_add = street_address.split(' ')

        let houseNum = split_street_add[0].trim()
        let street = split_street_add[1].trim() + ' ' + split_street_add[2].trim()

        let city = split_address[1].trim()
        let province = split_address[2].trim()
        let country = split_address[3].trim()

        document.getElementById('houseNum').value = houseNum
        document.getElementById('streetName').value = street
        document.getElementById('cityName').value = city
        document.getElementById('provinceName').value = province
        document.getElementById('countryName').value = country

        this.setState({ number : document.getElementById('houseNum').value})
        this.setState({ street : document.getElementById('streetName').value})
        this.setState({ city : document.getElementById('cityName').value})
        this.setState({ province : document.getElementById('provinceName').value})
        this.setState({ country : document.getElementById('countryName').value})
    };

    // creating listing
    submitListing(event){
        event.preventDefault();

        let myListing = {
                'currUserToken' : this.props.token,
                'number' : document.getElementById('houseNum').value,
                'street' : document.getElementById('streetName').value,
                'city' : document.getElementById('cityName').value,
                'province' : document.getElementById('provinceName').value,
                'country' : document.getElementById('countryName').value,
        }


        fetch('http://'+process.env.REACT_APP_IP+':5000/create_listing', {
                                                       method: 'POST',
                                                       mode: 'cors',
                                                       headers: {
                                                           'Content-Type' : 'application/json',
                                                           'Accept' : 'application/json'
                                                       }, 
                                                       credentials : 'include',
                                                       body: JSON.stringify(myListing)
                                                    }
        ).then((res) => {
            if(res.status === 200){
                (res.json()).then(res => {
                    this.setState({message : res.response})
                    let currFetch = '/user/profile/' + this.state.currUser;
                    this.props.history.push(currFetch)
                })
            } else{
                (res.json()).then(res => {
                    this.setState({message : res.response})
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    render(){
        return(
            <div>
                <Navbar token={this.props.token} removeCookieRequest={this.props.removeCookieRequest}/>
                <h4 className='searchAddressTitle'>Search an address: </h4> <br/>
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}

                        className='autocomplete'
                    >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
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
                    </PlacesAutocomplete>

                <div className='container listingFormInfo'>
                        <Number /> 
                        <Street />
                        <City />
                        <Province /> 
                        <Country /> 
                </div>
                <div className='container listingFormInfo2'>
                        <Submit submitListing={(event) => this.submitListing(event)} /><br/>
                        <Message userMessage={this.state.message}/>
                </div>
            </div>
        )
    }
}
function Message(props){
    return(
            <p className='createListingMessage'>{props.userMessage}</p>
    )
}

function Number(props){
    // default disabled field to avoid random address manipulation
    return(
        <div className='inputFormDiv'>
            <p className='inputFormDes'>House/building number: </p>
            <input className="form-control inputForm" id='houseNum' placeholder='123' disabled></input>
        </div>
    )
}

function Street(props){
    return(
        <div className='inputFormDiv'>
            <p className='inputFormDes'>Street Name: </p>
            <input className="form-control inputForm" id='streetName' placeholder='Sussex Rd' disabled></input>
        </div>
    )
}

function City(props){
    return(
        <div className='inputFormDiv'>
            <p className='inputFormDes'>City:</p>
            <input className="form-control inputForm" id='cityName' placeholder='Toronto' disabled></input>
        </div>
    )
}

function Province(props){
    return(
        <div className='inputFormDiv'>
            <p className='inputFormDes'>Province:</p>
            <input className="form-control inputForm" id='provinceName' placeholder='Ontario' disabled></input>
        </div>
    )
}

function Country(props){
    return(
        <div className='inputFormDiv'>
            <p className='inputFormDes'>Country:</p>
            <input className="form-control inputForm" id='countryName' placeholder='Canada' disabled></input>
        </div>
    )
}

function Submit(props){
    return(
        <div className='submitForm'>
            <button type="button" className='createListingButton' className="btn btn-primary btn-lg btn-block" onClick={props.submitListing}>Create Listing</button>
        </div>
    )
}

export default CreateListing;