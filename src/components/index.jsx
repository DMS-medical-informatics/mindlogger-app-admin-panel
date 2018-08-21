import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import {Provider} from 'react-redux';

import '../static/css/app.css';

import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './protected/Dashboard';
import Images from './protected/Images';
import Users from './protected/Users';
import Answers from './protected/Answers';
import AuthRoute from './authRoute';
import Header from './Header';
import SetupActs from './protected/SetupActs';
import TakeActs from './protected/TakeActs';
import TakeAct from './protected/TakeAct';
import EditSurvey from './modules/survey/EditSurvey';
import Profile from './protected/Profile';
import Organizations from './protected/Organizations';
import Library from './pages/library';
import Volume from './pages/library/Volume';

import Acts from './pages/acts';
import EditAct from './pages/acts/edit';

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
          <div className="container content">
            <div className="row">
              <Switch>
                <AuthRoute path='/' exact component={Library} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <AuthRoute path='/dashboard' component={Dashboard} />
                <AuthRoute path='/images' component={Images} />
                <AuthRoute path='/users/:id/answers' component={Answers} />
                <AuthRoute path='/users/:id/setup' component={SetupActs} />
                <AuthRoute path='/users' component={Users} />
                <AuthRoute path='/profile' component={Profile} />
                {/* <AuthRoute path='/acts' component={Acts} /> */}
                <AuthRoute path='/take/:actId' component={TakeAct} />
                <AuthRoute path='/take' component={TakeActs} />
                <AuthRoute path='/surveys/:id' component={EditSurvey} />
                <AuthRoute path='/organizations' component={Organizations} />
                <AuthRoute path='/library' component={Library}/>
                <AuthRoute path='/volumes/:id' component={Volume}/>
                <AuthRoute path='/acts/:id/edit' component={EditAct}/>
                <AuthRoute path='/acts/new' component={EditAct}/>
                <AuthRoute path='/acts' component={Acts}/>
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