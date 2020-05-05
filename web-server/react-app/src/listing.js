import React from 'react'

class Listing extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            message : '',
            address : null,
            city : null,
            province: null,
            country: null,
            contributor : null
        }
    }

    componentDidMount(){
        const  { id } = this.props.match.params

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
                    this.setState({address : res.response.number + ' ' + res.response.street, city : res.response.city, province : res.response.province,
                    country : res.response.country, contributor : res.response.contributor})
                })
            } else{
                (res.json()).then(res => {
                    this.setState({message : res.response})
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    render(){
        return(
            <div>
                <p>{this.state.message}</p>
                <p>Address: {this.state.address}</p>
                <p>City: {this.state.city}</p>
                <p>Province: {this.state.province}</p>
                <p>Country: {this.state.country}</p>
                <p>Contributor: {this.state.contributor}</p>
            </div>
        )
    }
}

export default Listing;