import React, { Component } from 'react';

export default class Bookmark extends Component {
  render() {
    const {index} = this.props;
    return (
      <div className="bookmark">
        <div className="thumb"></div>
        <div className="subtitle">Screen {index} of 42</div>
      </div>
    );
  }
}