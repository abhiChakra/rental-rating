import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'
import Navbar from './navbar'

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

    handleSelect = address => {
        console.log(address)

        let split_address = address.split(',')
        let street_address = split_address[0]
        let split_street_add = street_address.split(' ')

        console.log(split_street_add)

        let houseNum = split_street_add[0].trim()
        let street = split_street_add[1].trim() + ' ' + split_street_add[2].trim()

        let city = split_address[1].trim()
        let province = split_address[2].trim()
        let country = split_address[3].trim()

        console.log(street, city, province, country)
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

    submitListing(event){
        event.preventDefault();

        console.log(document.getElementById('houseNum').value)

        let myListing = {
                'number' : document.getElementById('houseNum').value,
                'street' : document.getElementById('streetName').value,
                'city' : document.getElementById('cityName').value,
                'province' : document.getElementById('provinceName').value,
                'country' : document.getElementById('countryName').value,
        }
        
        console.log(JSON.stringify(myListing))

        fetch('http://127.0.0.1:5000/create_listing', {
                                                       method: 'POST',
                                                       mode: 'cors',
                                                       headers: {
                                                           'Content-Type' : 'application/json'
                                                       }, 
                                                       credentials : 'include',
                                                       body: JSON.stringify(myListing)
                                                    }
        ).then((res) => {
            if(res.status == 200){
                (res.json()).then(res => {
                    this.setState({message : res.respose})
                    let currFetch = '/user/profile/' + this.state.currUser;
                    this.props.history.push(currFetch)
                })
            } else{
                (res.json()).then(res => {
                    this.setState({message : res.respose})
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    render(){
        return(
            <div>
                <Navbar />
                <h2>Create new Listing</h2> <br/>

                <h4>Search your address below:</h4>
                <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input  {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                        })} />

                        <div>
                            {loading ? <div>...loading </div> : null}

                            {suggestions.map((suggestion) => {
                                return(
                                    <div {...getSuggestionItemProps(suggestion)}>
                                        {suggestion.description}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                </PlacesAutocomplete>

                <Number /> <br/>
                <Street /> <br/>
                <City /> <br />
                <Province /> <br/>
                <Country /> <br/><br/>
                <Submit submitListing={(event) => this.submitListing(event)} /><br/>
                <Message userMessage={this.state.message}/>
            </div>
        )
    }
}
function Message(props){
    return(
        <p>{props.userMessage}</p>
    )
}

function Number(props){
    return(
        <div>
            <p>House/building number: </p>
            <input id='houseNum' placeholder='123'></input>
        </div>
    )
}

function Street(props){
    return(
        <div>
            <p>Street Name: </p>
            <input id='streetName' placeholder='Sussex Rd'></input>
        </div>
    )
}

function City(props){
    return(
        <div>
            <p>City:</p>
            <input id='cityName' placeholder='Toronto'></input>
        </div>
    )
}

function Province(props){
    return(
        <div>
            <p>Province:</p>
            <input id='provinceName' placeholder='Ontario'></input>
        </div>
    )
}

function Country(props){
    return(
        <div>
            <p>Country:</p>
            <input id='countryName' placeholder='Canada'></input>
        </div>
    )
}

function Submit(props){
    return(
        <button onClick={props.submitListing}>Submit</button>
    )
}

export default CreateListing;