import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import {Provider} from 'react-redux'

import Login from './Login'
import Register from './Register'
import Home from './Home'
import Dashboard from './protected/Dashboard'
import Images from './protected/Images'
import Users from './protected/Users'
import Answers from './protected/Answers'
import { logout } from '../helpers/auth'
import AuthRoute from './authRoute'
import Header from './Header'

export default class App extends Component {
  componentDidMount () {
  }
  componentWillUnmount () {
    
  }
  render() {
    return (
      <Provider store={this.props.store} >
      <BrowserRouter>
        <div>
          <Header />
          <div className="container">
            <div className="row">
              <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <AuthRoute path='/dashboard' component={Dashboard} />
                <AuthRoute path='/images' component={Images} />
                <AuthRoute path='/users/:id/answers' component={Answers} />
                <AuthRoute path='/users' component={Users} />
                <Route render={() => <h3>No Match</h3>} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
      </Provider>
    );
  }
}