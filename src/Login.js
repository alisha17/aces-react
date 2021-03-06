import React from 'react';
import Button from '@material-ui/core/Button';
import { FormLabel, TextField, FormControl, Grid } from '@material-ui/core';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      userLoggedIn: false,
      messages: [],
      newMessage: ''
    };
  }

  handleNameChange = event => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleChange = event => {
    this.setState({ newMessage: event.target.value });
  };

  addNewMessage = message => {
    this.setState({
      messages: [...this.state.messages, message]
    });

    const opts = {
      method: 'POST',
      body: JSON.stringify({'message': message}),
      headers: {
        'Authorization': sessionStorage.getItem('bearer_token'),
      }
    };

    fetch(
      'http://18.219.29.236:5000/messages/'+this.state.username, opts
    )

    this.setState({ newMessage: '' });
  };

  logout = () => {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': sessionStorage.getItem('bearer_token'),
      }}

    fetch(
      'http://18.219.29.236:5000/logout/' + this.state.username, options
    ).then(res => {
      sessionStorage.clear();
      this.setState({ userLoggedIn: false });
      window.location.assign('/');
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    const opts = {
      method: 'POST',
      body: JSON.stringify(user)
    };

    fetch('http://18.219.29.236:5000/login', opts)
      .then(res => {  if (res.ok) {
        return res.json();
      } else {
        throw new Error('Something went wrong');
      } })
      .then(response => {
    
        this.setState({ userLoggedIn: true });

        const bearer = 'Bearer '+response['access_token'];
        sessionStorage.setItem('bearer_token', bearer)

        const options = {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('bearer_token'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true
          }}

        return fetch(
          'http://18.219.29.236:5000/messages/' + this.state.username,
          options
        );
      
      })
      .then(rs => rs.json()).then(response => {
        this.setState({messages: response['data']})
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const messages = this.state.messages ? this.state.messages : [];

    if (!this.state.userLoggedIn) {
      return (
        <Grid
          container
          spacing={0}
          alignItems='center'
          justify='center'
          style={{ minHeight: '100vh' }}
        >
          <div className='container'>
            <FormControl>
              <FormLabel>
                Username:
                <TextField name='username' onChange={this.handleNameChange} />
              </FormLabel>
              <FormLabel>
                Password:
                <TextField
                  type='password'
                  name='password'
                  onChange={this.handlePasswordChange}
                />
              </FormLabel>
              <div>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleSubmit}
                >
                  Login
                </Button>
              </div>
            </FormControl>
          </div>
        </Grid>
      );
    } else {
      return (
        <Grid
          container
          spacing={0}
          alignItems='center'
          justify='center'
          style={{ minHeight: '100vh' }}
        >
          <div>
            <ul>
              {messages.map((value, index) => {
                return <li key={index}>{value}</li>;
              })}
            </ul>
            <FormLabel>
              New message:
              <TextField
                value={this.state.newMessage}
                onChange={this.handleChange}
              />
            </FormLabel>
            <div>
              <Button
                variant='contained'
                color='primary'
                onClick={() => this.addNewMessage(this.state.newMessage)}
              >
                {' '}
                Add
              </Button>
              &nbsp;
              <Button
                variant='contained'
                color='primary'
                onClick={() => this.logout()}
              >
                Logout
              </Button>
            </div>
          </div>
        </Grid>
      );
    }
  }
}

export default Login;
