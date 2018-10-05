import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';
import { getUsers, addFolder, copyObject } from '../../../actions/api';
import { setPageTitle } from '../../../actions/core';

class Users extends Component {
  componentWillMount() {
    const { volume: {meta: data}, getUsers, setPageTitle } = this.props;
    getUsers();
    setPageTitle(`Manage ${data.shortName} Users`);
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
        <p className="pt-3">
          Here you can add, edit, or remove Users of the ETA Activity Set, and add, edit, or delete Viewers of their data.
          <br/>
          Users perform Activities in the App, and Viewers can view their data in a Dashboard.
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
  setPageTitle,
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
