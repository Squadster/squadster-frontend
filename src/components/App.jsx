import React from "react";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from './Navbar';
import Squad from './Squad';
import PrivateRoute from './PrivateRoute'
import AuthCallback from "./auth/AuthCallback.jsx";
import Squads from "./Squads.jsx";
import About from "./About.jsx";

function setAxiosInterceptors() {
  axios.interceptors.request.use(function (config) {
    const token = localStorage.authToken;
    config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  });
}

export default function App() {
  setAxiosInterceptors();

  return (
    <Router>
      <div>
        <nav>
          <Navbar />
        </nav>

        <Switch>
          <Route path="/about" component={About} />
          <PrivateRoute path="/squads" component={Squads} />
          <PrivateRoute path="/my-squad" component={Squad} />
          <Route path="/auth_callback" component={AuthCallback} />
          <Route path='*' exact={true} component={() => <Redirect to='/' />} />
        </Switch>
      </div>
    </Router>
  );
}
