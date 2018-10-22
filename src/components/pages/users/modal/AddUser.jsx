import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {SubmissionError} from 'redux-form';
import {Modal} from 'react-bootstrap';

import AddUserForm from './AddUserForm';
import { inviteUser, setUserTemporary} from '../../../../actions/api';
class AddUser extends Component {
  static propTypes = {
    groupName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }
  componentWillMount() {
    this.setState({});
    console.log(this.props.volume);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show && nextProps.show === true) {
      let password = (crypto.getRandomValues(new Uint32Array(1))*12).toString();
      this.setState({password});
    }
  }

  onAddUser = (body) => {
    const {inviteUser, setUserTemporary, onAdd} = this.props;
  
    return inviteUser(body, {})
      .then(user =>
        setUserTemporary(body.email).then(res => {
          console.log(user);
          return onAdd(user);
        })
      ).catch(err => {
        let valErrors = {_error:`${err.type} errors`};
        valErrors[err.field] = err.message;
        throw new SubmissionError(valErrors);
      });
  }
  render() {
    const {show, groupName, onClose} = this.props;
    const {password} = this.state;
    return (
      <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add new {groupName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddUserForm onSubmit={this.onAddUser} initialValues={{password}}/>
      </Modal.Body>
    </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  volume: state.entities.volume
})

const mapDispatchToProps = {
  inviteUser, setUserTemporary
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUser)
