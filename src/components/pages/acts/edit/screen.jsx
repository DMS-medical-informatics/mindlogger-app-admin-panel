import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';

import ScreenForm from './screen-form';

export default class Screen extends Component {
  render() {
    return (
      <div className="screen">
        <a href="#display">Screen display</a>
        <br/>
        <a href="#survey">Survey</a>
        <br/>
        <a href="#canvas">Canvas</a>
        <ScreenForm />
      </div>
    );
  }
}