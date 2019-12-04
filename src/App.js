import React from 'react';
import { NoMatchPage } from './NoMatchPage'
import { Weather } from './weather';
import Facebook from './Login';
import { Home } from './Home'
import { Navbar } from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Facebook} />
        <Route path='/weather' component={Weather} />
        <Route component={NoMatchPage} />
      </Switch>
    </Router>
  );
}
export default App;
