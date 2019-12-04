import React from 'react';
import { NoMatchPage } from './NoMatchPage'
import { Weather } from './weather';
import Login from './Login';
import { Navbar } from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar/>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/weather' component={Weather} />
        <Route component={NoMatchPage} />
      </Switch>
    </Router>
  );
}
export default App;
