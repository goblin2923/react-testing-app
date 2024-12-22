import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import CustomerDetails from './CustomerDetails'
import axios from 'axios'

export default class Customers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedCustomer: 1
    }
  }

  //function which is called the first time the component loads
  componentDidMount() {
    this.getCustomerData();
  }

  //Function to get the Customer Data from json
  getCustomerData() {
    axios.get('assets/samplejson/customerlist.json').then(response => {
      this.setState({customerList: response})
    })
  };

  render() {
    if (!this.state.customerList)
      return (<p>Loading data</p>)
    return (<div className="addmargin">
      <div className="col-md-3">
        {

          this.state.customerList.data.map(customer => 
            <Card bg="info" text="white" key={customer.name} className="centeralign" style={{ padding: '20px' }}>
              <Card.Header as="h3">{customer.name}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <p>{customer.email}</p>
                  <p>{customer.phone}</p>
                </Card.Text>
                <Button variant="info" onClick={() => this.setState({selectedCustomer: customer.id})}>
                  Click to View Details
                </Button>
              </Card.Body>
            </Card>
          )
        }
      </div>
      <div className="col-md-6">
        <CustomerDetails val={this.state.selectedCustomer}/>
      </div>
    </div>)
  }

}
