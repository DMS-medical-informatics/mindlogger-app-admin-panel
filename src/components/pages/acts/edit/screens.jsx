import React, { Component } from 'react';
import Bookmarks from './bookmarks';
import Screen from './screen';
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
