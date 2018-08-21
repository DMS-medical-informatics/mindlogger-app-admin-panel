import React, { Component } from 'react';
import Bookmark from './Bookmark';
export default class Bookmarks extends Component {
  render() {
    const {screens, index, onSelect} = this.props;
    return (
      <div className="bookmarks">
        { screens && screens.map((screen,idx) =>
          <Bookmark index={idx} key={idx} selected={idx === index} onSelect={onSelect} screen={screen}/>)
        }
      </div>
    );
  }
}