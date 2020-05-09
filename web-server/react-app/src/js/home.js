import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import PlacesAutocomplete from 'react-places-autocomplete'
import '../css/home.css'

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userMessage : 'Welcome! Login or signup!',
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
                    this.setState({userMessage: 'Welcome back ' + res.response.username})
                })
            } else{
                return null;
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    componentDidMount(){
       this.checkAuthenticated();
    }

    // logoutAction(event){
    //     event.preventDefault();
    //     fetch('http://127.0.0.1:5000/logout', {
    //                                     method: 'GET',
    //                                     mode: 'cors',
    //                                     headers : {
    //                                         'Accept': 'application/json'
    //                                        },
    //                                     credentials: 'include'
    //                                    }
    //     ).then(res => {
    //         if(res.status === 200){         
    //             this.setState({authenticated : false, userMessage : 'Welcome! Login or signup!'})
    //             this.props.history.push('/');
    //         } else{
    //             (res.json()).then((res) => {
    //                 this.setState({userMessage : res.response})
    //             })
    //         }
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }

    handleChange = address => {
        this.setState({ address });
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

        console.log(
            this.state.number, this.state.street, this.state.city, this.state.province, this.state.country
        )

        let currFetch = 'http://127.0.0.1:5000/get_listing_query?' + 
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
                    console.log(res.response)
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
                    <Navbar />

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
                            </div>
                            <br/>
                            <div className='searchBar'>
                                <div className='searchInput'>
                                <input 
                               aria-label = "Recipient's username"
                               aria-describedby = "basic-addon2"
                                {...getInputProps({
                                    placeholder: '24 Sussex Drive, Ottawa, ON, Canada',
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

                    <QueryListings queryListings={this.state.queryRes}/>

                    <div>{this.state.message}</div>
                </div>
            )
        }
}

function QueryListings(props){
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
}

export default Home