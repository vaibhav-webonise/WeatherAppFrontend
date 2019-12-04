import React from 'react';
import { WEATHER_API_KEY, API_URL, PAGE_NO, STATUS_NOT_FOUND, STATUS_OK, INTERNAL_SERVER_ERROR } from './AppConstants'
import axios from 'axios';
import './weather.css'
import { Link } from 'react-router-dom'

export class Weather extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      city: '',
      clouds: '',
      location: '',
      humidity: '',
      username: '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    if (localStorage.getItem('idToken') !== 'invalid') {
      axios({
        method: 'GET',
        url: `${API_URL}/cities/${localStorage.getItem('username')}/${PAGE_NO}`,
        headers:
        {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.status === STATUS_OK) {
          this.setState({ city: response.data[0].cityname });
          this.getInfo();
        }
      }).catch((error) => {
        if (error.response.status === STATUS_NOT_FOUND) {
          this.setState({ errorMessage: 'Could not find previously visited city' });
        }
      })
    }
  }

  saveCity = (city) => {
    axios({
      method: 'POST',
      url: `${API_URL}/cities/${localStorage.getItem('username')}`,
      data: {
        cityname: city,
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      this.setState({ errorMessage: null, });
    }).catch((error) => {
      if (error.response.status === INTERNAL_SERVER_ERROR) {
        this.setState({ errorMessage: 'Sorry!, Your search is not recorded' });
      } else if (error.response.status === STATUS_NOT_FOUND) {
        this.setState({ errorMessage: error.response.data });
      }
    })
  }

  onUserType = event => {
    this.setState({ city: event.target.value, });
  };

  getInfo = () => {
    axios({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&APPID=${WEATHER_API_KEY}`,
    }).then((response) => {
      this.saveCity(this.state.city);
      this.setState(
        {
          clouds: response.data.weather[0].description,
          location: response.data.name,
          humidity: response.data.main.humidity,
          city: '',
        })
    }).catch((error) => {
      if (error.response.status === STATUS_NOT_FOUND) {
        this.setState({ errorMessage: 'You have entered invalid city name', city: '', });
      }
    })
  }

  render() {
    if (localStorage.getItem('idToken') !== 'invalid') {
      return (
        <div className='App'><br /><br />
          <h3>Welcome {localStorage.getItem('username')}</h3><br /><br />

          <label for='city'>Enter city name </label><input type='text' name='city' value={this.state.city} onChange={this.onUserType} placeholder='Enter city name' />
          <input onClick={this.getInfo} type='button' value='submit' />

          <div className='weatherWidget' >
            <h4>Check the weather information of your city</h4>
            <h5>City: {this.state.location}</h5>
            <h5>Clouds: {this.state.clouds}</h5>
            <h5>Humidity: {this.state.humidity}</h5>
          </div>
          <h4 className='errorMessage'>{this.state.errorMessage}</h4>
        </div>
      );
    }
    else {
      return (
        <div className='App'><h3>You are currently logout <Link to='/'>click here</Link> to log in</h3></div>
      )
    }
  }
}
