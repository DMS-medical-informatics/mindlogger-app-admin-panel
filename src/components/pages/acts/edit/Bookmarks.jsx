import React, { Component } from 'react';
import Bookmark from './Bookmark';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

export default class Bookmarks extends Component {
  render() {
    const {screens, index, onSelect, onAdd} = this.props;
    return (
      <div className="bookmarks">
        { screens && screens.map((screen,idx) =>
          <Bookmark index={idx} key={idx} selected={idx === index} onSelect={onSelect} screen={screen}/>)
        }
        <center className="p-3">
          <Button variant="fab" aria-label="Add" onClick={onAdd}>
            <AddIcon />
          </Button>
        </center>
      </div>
    );
  }
}