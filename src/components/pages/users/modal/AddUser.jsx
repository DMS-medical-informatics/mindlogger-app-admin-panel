import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {SubmissionError} from 'redux-form';
import {Modal} from 'react-bootstrap';

import AddUserForm from './AddUserForm';
import { inviteUser, setUserTemporary, addFolder, getObject, updateFolderMeta } from '../../../../actions/api';
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

  userDetails = (user) => {
    const {volume} = this.props;
    return addFolder("Members", {}, volume._id, "folder", true).then(members => {
      return getObject("folder/members._id").then(membersFolder => {
        if (user._id in membersFolder.meta) {
          return(membersFolder.meta[user._id]);
        } else {
          let newMeta = membersFolder.meta;
          newMeta[user._id] = user;
          updateFolderMeta(newMeta);
          return(user);
        }
      });
    });
  }

  onAddUser = (body) => {
    const {inviteUser, setUserTemporary, onAdd} = this.props;
    return inviteUser(body, {})
      .then(user =>
        setUserTemporary(body.email).then(res => {
          console.log(user);
          this.userDetails(user);
          return onAdd(user);
        })
      ).catch(err => {
        let valErrors = {_error:`${err.type} errors`};
        console.log(err.message.substring(33,err.message.length));
        if(err.message.substring(0,33)=="That email is already registered:"){
          return(this.userDetails(
            {"_id": err.message.substring(33,err.message.length),
            "firstName": body.firstName, "lastName": body.lastName,
            "login": body.login, "email": body.email}
          ));
        } else {
          valErrors[err.field] = err.message;
          throw new SubmissionError(valErrors);
        }
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
  inviteUser, setUserTemporary, addFolder, getObject, updateFolderMeta
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUser)
