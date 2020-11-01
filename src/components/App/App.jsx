import React, { useState, useCallback } from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Squad from './components/Squad/Squad'
import PrivateRoute from './components/PrivateRoute'
import AuthCallback from "./components/AuthCallback.jsx"
import Squads from "./components/Squads/Squads.jsx"
import About from "./components/About.jsx"
import { useSelector, useDispatch } from 'react-redux'
import { GET_CURRENT_USER } from 'requests'
import { useQuery } from '@apollo/react-hooks'
import Spinner from './components/shared/Spinner'
import { setCurrentUser } from 'actions/current_user_actions'
import { setAxiosInterceptors, logout } from 'helpers'
import NewSquad from "./components/NewSquad/NewSquad"
import Landing from './components/Landing'
import MuiAlert from '@material-ui/lab/Alert'
import { Snackbar } from '@material-ui/core'
import { AlertContext } from 'contexts'
import Profile from './components/Profile/Profile'
import InvitationAuth from './components/InvitationAuth'

function Alert(props) { return <MuiAlert elevation={6} variant="filled" {...props} /> }

export default function App() {
  setAxiosInterceptors()  
  const dispatch = useDispatch()

  const user = useSelector(state => state.currentUser)
  const { loading, data } = useQuery(GET_CURRENT_USER, { skip: !localStorage.authToken, onError: () => logout(dispatch) } )

  // Alert state can be moved to the separate hook it's not necessary for now
  // as we have one global Snackbar
  //
  const [alertState, setAlertState] = useState({})
  const [openAlert, setOpenAlert] = useState(false)
  const closeAlert = useCallback(() => setOpenAlert(false), [])
  const showAlert = useCallback(({variant='success', message, duration=5000}) => {
    setAlertState({variant: variant, message: message, duration: duration})
    setOpenAlert(true)
  }, [])

  if (loading) {
    return <Spinner/>
  }

  if (!user && data && data.currentUser)
      dispatch(setCurrentUser(data.currentUser))

  return (
    <Router>
      <div>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={alertState.duration} open={openAlert} onClose={closeAlert}>
          <Alert onClose={closeAlert} severity={alertState.variant || 'success'}>
            {alertState.message}
          </Alert>
        </Snackbar>
        <AlertContext.Provider value={showAlert}>
          <Navbar />
          <div className='d-flex flex-column' style={{minHeight: '90vh'}}>
            <Switch>
              <Route exact path="/about" component={About} />
              <PrivateRoute exact path="/squads" component={Squads} />
              <PrivateRoute exact path="/my_squad" component={Squad} />
              <PrivateRoute exact path="/new_squad" component={NewSquad} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <Route path="/invitation/:hash_id" component={InvitationAuth} />
              <Route path="/auth_callback" component={AuthCallback} />
              <Route path="/" component={user ? () => <Redirect to='/my_squad' /> : Landing} />
              <Redirect from="*" to="/" />
            </Switch>
            <div className='pb-5' />
            <Footer />
          </div>
        </AlertContext.Provider>
      </div>
    </Router>
  );
}
