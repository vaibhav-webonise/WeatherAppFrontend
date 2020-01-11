import React from 'react';
import { WEATHER_API_KEY, API_URL, PAGE_NO, STATUS_NOT_FOUND, NETWORK_ERROR, UNAUTHORIZED, STATUS_OK, COUNT_ZERO, STATUS_CONFLICT, INTERNAL_SERVER_ERROR } from './AppConstants'
import axios from 'axios';
import './weather.css'
import { Link } from 'react-router-dom'
import { ListWidgets } from './ListWidgets';

export class Weather extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchCity: '',
      username: '',
      errorMessage: '',
      weatherData: [],
      flag: false,
      tempWeatherInfo: null,
    };
  }

  componentDidMount() {
    if (localStorage.getItem('idToken') !== 'invalid') {
      axios({
        method: 'GET',
        url: `${API_URL}/cities/${PAGE_NO}`,
        params: {
          'username': localStorage.getItem('username'),
        },
        headers:
        {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.getWeatherData(response.data[i].cityname)
        }
      }).catch((error) => {
        if (error.message === NETWORK_ERROR) {
          this.setState({ errorMessage: error.message });
        } else if (error.response.status === STATUS_NOT_FOUND) {
          this.setState({ errorMessage: 'No recent search available' });
        }
      })
    }
  }

  addCity = (city) => {
    axios({
      method: 'POST',
      url: `${API_URL}/cities/${city}`,
      data: {
        'username': localStorage.getItem('username'),
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      this.setState({
        weatherData: [...this.state.weatherData, this.state.tempWeatherInfo],
        errorMessage: null,
        searchCity: null,
      });
    }).catch((error) => {
      if (error.message === NETWORK_ERROR) {
        this.setState({ errorMessage: error.message });
      } else if (error.response.status === UNAUTHORIZED) {
        alert(error.response.data.message);
        this.props.history.push('/');
      } else if (error.response.status === STATUS_NOT_FOUND) {
        this.setState({ errorMessage: error.response.data.message });
      } else if (error.response.status === STATUS_CONFLICT) {
        this.setState({ errorMessage: error.response.data.message });
      }
    })
  }

  onUserType = event => {
    this.setState({ searchCity: event.target.value, });
  };

  getWeatherData = (city) => {
    if (city.trim() !== '') {
      axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${WEATHER_API_KEY}`,
      }).then((response) => {
        let weatherData = {
          clouds: response.data.weather[0].description,
          location: response.data.name,
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
        }
        if (this.state.flag) {
          this.setState({ tempWeatherInfo: weatherData, });
          this.addCity(city.trim());
          this.setState({ flag: false, searchCity: '', });
        }
        else {
          this.setState({ weatherData: [...this.state.weatherData, weatherData], });
        }
      }).catch((error) => {
        if (error.message === NETWORK_ERROR) {
          this.setState({ errorMessage: error.message });
        } else if (error.response.status === STATUS_NOT_FOUND) {
          this.setState({ errorMessage: 'You have entered invalid city name', searchCity: '', });
        }
      })
    } else {
      this.setState({ errorMessage: 'Invalid input', searchCity: '', });
    }
  }

  setFlag = (event) => {
    event.preventDefault();
    this.setState({ flag: true, });
    this.getWeatherData(this.state.searchCity);
  }

  removeWidget = (city) => {
    axios({
      method: 'DELETE',
      url: `${API_URL}/cities/${city}`,
      data: {
        'username': localStorage.getItem('username'),
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status === STATUS_OK && response.data > COUNT_ZERO) {
        let weatherData = this.state.weatherData.filter((weatherDataObject) => weatherDataObject.location !== city);
        this.setState({ weatherData, errorMessage: '', })
      }
    }).catch((error) => {
      if (error.message === NETWORK_ERROR) {
        this.setState({ errorMessage: error.message });
      } else if (error.response.status === UNAUTHORIZED) {
        alert(error.response.data.message);
        this.props.history.push('/');
      } else if (error.response.status === STATUS_NOT_FOUND) {
        this.setState({ errorMessage: error.response.data.message });
      } else if (error.response.status === INTERNAL_SERVER_ERROR) {
        this.setState({ errorMessage: error.response.data.message });
      }
    })
  }

  render() {
    if (localStorage.getItem('idToken') !== 'invalid') {
      return (
        <div><br />
          <h3>Welcome {localStorage.getItem('username')}</h3>
          <form onSubmit={this.setFlag}>
            <input type='text' name='city' value={this.state.searchCity} required onChange={this.onUserType} placeholder='Enter city name' />
            <input type='submit' value='+' />
          </form><br />
          <ListWidgets weatherInfo={this.state.weatherData} removeWidget={this.removeWidget}></ListWidgets>
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
