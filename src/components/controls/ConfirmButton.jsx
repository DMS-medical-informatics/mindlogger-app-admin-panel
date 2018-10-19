import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import ConfirmDialog from './ConfirmDialog';

export default class ConfirmButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
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
    const {text, children, onClick, ...props} = this.props;
    return (
      <div>
        <Button onClick={this.showConfirmDialog} {...props}>{children}</Button>
        <ConfirmDialog show={this.state.show} onClose={this.onClose} onClick={this.onClick}>
          {text}
        </ConfirmDialog>
      </div>
    )
  }
}
