import React, { Component } from 'react';

export default class Screen extends Component {
  render() {
    return (
      <div className="screen">
        <a href="#display">Screen display</a>
        <br/>
        <a href="#activity">Screen Activity</a>
        <br/>
        <a href="#canvas">Canvas activity</a>
      </div>
    );
  }
}