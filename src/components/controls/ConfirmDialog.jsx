import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

export default class ConfirmDialog extends Component {
  onClick= () => {
    const {onClose, onClick} = this.props;
    onClose();
    onClick();
  }
  render() {
    const {show, onClose, children} = this.props;
    return (
      <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={show}
            onClose={this.onClose}
          >
        <Paper className="modal-paper">
          <div>{children}</div>
          <div className="modal-buttons">
            <Button variant="contained" color="secondary" onClick={this.onClick}>Yes</Button>
            <Button variant="contained" onClick={onClose}>Cancel</Button>
          </div>
        </Paper>
        </Modal>
    )
  }
}
