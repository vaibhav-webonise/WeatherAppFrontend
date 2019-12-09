import React from 'react'
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import axios from 'axios'
import firebase from './Firebase'
import logo from './logo.svg'
import './App.css'
import { API_URL, NETWORK_ERROR } from './AppConstants'

export class Facebook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      username: '',
      errorMessage: null,
    }

    this.uiConfig = {
      signInFlow: "popup",
      signInOptions:
        [firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        ],
      callbacks: {
        signInSuccess: () => {
          window.location.assign(`/weather`);
        },
      }
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if (user) {
        console.log("logged in use:", user.uid)
        localStorage.setItem('idToken', user.uid);
        localStorage.setItem('username', user.displayName);
        this.saveUserInDatabase(user.displayName, user.uid);
      }
      else {
        localStorage.setItem('idToken', 'invalid');
      }
    })
  }

  saveUserInDatabase = (userName, uId) => {
    axios({
      method: 'POST',
      url: `${API_URL}/users`,
      data: {
        username: userName,
        uniqueId: uId,
      }
    }).then((response) => {
      localStorage.setItem('jwtToken', response.data.jwt);
    }).catch((error) => {
      if (error.message === NETWORK_ERROR) {
        this.setState({ errorMessage: error.message });
        firebase.auth().signOut()
      } else {
        this.setState({ errorMessage: error.response.data.message });
      }
    })
  }

  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo'></img>
          <h2>Welcome to Weather application</h2>
        </div>
        <br />
        {this.state.isSignedIn ? (
          <div>
            <h3>Signed In!</h3>
            <h3>Welcome {firebase.auth().currentUser.displayName}</h3>
            <img src={firebase.auth().currentUser.photoURL}></img><br /><br />
            <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
            <h4>{this.state.errorMessage}</h4>
          </div>
        ) : (
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
          )}
      </div>
    )
  }
}
export default Facebook;
