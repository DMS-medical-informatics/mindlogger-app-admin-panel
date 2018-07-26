import React, { Component } from 'react';
import Bookmark from './bookmark';
export default class Bookmarks extends Component {
  render() {
    return (
      <div className="bookmarks">
        <Bookmark index={1}/>
      </div>
    );
  }
}