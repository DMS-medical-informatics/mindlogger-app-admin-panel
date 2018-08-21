import React, { Component } from 'react';
import cn from 'classnames';

export default class Bookmark extends Component {
  render() {
    const {index, selected, onSelect} = this.props;
    return (
      <div className={cn("bookmark", {selected})}>
        <div className="thumb" onClick={() => !selected && onSelect(index)}></div>
        <div className="subtitle">Screen {index+1} of 42</div>
      </div>
    );
  }
}