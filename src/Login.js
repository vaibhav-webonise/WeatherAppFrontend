import React from 'react'
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import axios from 'axios'
import firebase from './Firebase'
import logo from './logo.svg'
import './App.css'
import { API_URL } from './AppConstants'

export class Facebook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      username: '',
    }
  }

  uiConfig = {
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

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if (user) {
        this.saveUserInDatabase(user.displayName, user.uid);
        sessionStorage.setItem('idToken', user.uid);
        sessionStorage.setItem('username', user.displayName);
      }
      else {
        sessionStorage.setItem('idToken', 'invalid');
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
      console.log(error.message);
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
