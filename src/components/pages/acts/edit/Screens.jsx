import React, { Component } from 'react';
import Bookmarks from './Bookmarks';
import Screen from './Screen';
export default class Screens extends Component {
  render() {
    return (
      <div className="screens">
        <Bookmarks />
        <Screen />
      </div>
    );
  }
}
