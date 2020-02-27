import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import './assets/css/default.styles.css';

import theme from "./assets/jss/theme";
import store from "./store/index";
import App from "./components/App";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo'
import { API_HOST } from './constants'

const client = new ApolloClient({
  uri: API_HOST + '/api/query',
  request: (operation) => {
    const token = localStorage.authToken
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  }
})

window.store = store;

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
