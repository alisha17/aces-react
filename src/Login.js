import React from 'react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { FormLabel, TextField, FormControl, Grid } from '@material-ui/core';

class Login extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      userLoggedIn: false,
      messages: ['fbfbbfbf', 'dhbdhdhdhd'],
      newMessage: ''
    }
  }

  handleNameChange = event => {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  }

  handleChange = event => {
    this.setState({ newMessage: event.target.value });
  }

  addNewMessage = message => {
    console.log("hehbfbfbfb")
    this.setState({
      messages: [...this.state.messages, message]
    })
    this.setState({newMessage: ''})
    console.log(this.state.messages);
  }

  logout = () => {
    fetch('http://localhost:5000/logout/'+sessionStorage.getItem('username'))
      .then(res => {
        window.location.assign('/');
      })
  }

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    const b = {
      method: 'POST',
      body: JSON.stringify(user),
    }

    fetch('http://18.219.29.236:5000/login', b)
      .then(res => {
        console.log(res);

        this.setState({userLoggedIn: true});
        return fetch('http://18.219.29.236:5000/messages/'+this.state.username, {credentials: 'include'});
      })
      .then((response) => {
        console.log('Response', response);
      })
  }

  render() {
    
    if (!this.state.userLoggedIn)
    {
      return (
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
          >
        <div class="container">
          <FormControl>
            <FormLabel>
              Username:
              <TextField 
                floatingLabelText="Fixed Floating Label Text"
                name="username" 
                onChange={this.handleNameChange} />
            </FormLabel>
            <FormLabel>
              Password:
              <TextField
                name="password" 
                onChange={this.handlePasswordChange} 
              />
            </FormLabel>
            <div>
            <Button variant="contained" 
              color="primary" 
              onClick={this.handleSubmit}>
              Login</Button>
              </div>
          </FormControl>
        </div>
        </Grid>
      )
    }
    else {
      return (
        <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        >
        <div>
        <ul>
        {this.state.messages.map((value, index) => {
          return <li key={index}>{value}</li>
        })}
    </ul>
    <FormLabel>
      Enter your message:
        <TextField
            value={this.state.newMessage}
            onChange={this.handleChange}
         />
             </FormLabel>
          <div>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => this.addNewMessage(this.state.newMessage)
					}> Add
					</Button>
          &nbsp;
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => this.logout()}>
						Logout
					</Button>
          </div>
            </div>
            </Grid>
      )
    }
  }
}

export default Login;
