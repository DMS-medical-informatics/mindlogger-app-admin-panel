import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';
import { getUsers, addFolder, copyObject } from '../../../actions/api';

class Users extends Component {
  componentWillMount() {
    this.props.getUsers();
  }

  handleMember = (user) => {
    const { addFolder, copyObject, volume } = this.props;
    return addFolder('Volumes', {}, user._id, 'user').then(folder => {
      return copyObject(volume._id, 'folder', folder._id, 'folder');
    })
  }

  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div>
        <p>
          Manage {data.shortName} Users.
          <br/>
          Tap [+] on the left to add a User. Tap any User to edit or delete the User.
        </p>
        <GroupTable group='users' groupName='User' onAddMember={this.handleMember} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  volume: state.entities.volume,
})

const mapDispatchToProps = {
  getUsers,
  copyObject,
  addFolder,
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
