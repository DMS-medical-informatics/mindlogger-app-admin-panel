import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

export default class ConfirmButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
    buttonText: PropTypes.string,
  }

  state = {
    show: false
  }

  onClose = () => {
    this.setState({show: false});
  }
  onClick = () => {
    this.onClose();
    this.props.onClick();
  }
  showConfirmDialog = () => {
    this.setState({show: true});
  }
  render() {
    const {text, buttonText, onClick} = this.props;
    return (
      <div>
        <Button variant="contained" color="secondary" onClick={this.showConfirmDialog}>{buttonText}</Button>
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.show}
            onClose={this.onClose}
          >
        <Paper className="modal-paper">
          <p>{text}</p>
          <div className="modal-buttons">
            <Button variant="contained" color="secondary" onClick={this.onClick}>Yes</Button>
            <Button variant="contained" onClick={this.onClose}>Cancel</Button>
          </div>
        </Paper>
        </Modal>
      </div>
    )
  }
}
