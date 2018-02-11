import React, { Component } from 'react';
import { Provider } from 'react-redux'
import routes from './routes'

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        {routes}
      </Provider>
    );
  }
}

export default App;
