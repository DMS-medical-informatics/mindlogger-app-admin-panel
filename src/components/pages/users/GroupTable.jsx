import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddUser from './modal/AddUser';

import { updateObject, getUsers, getFolderAccess, updateFolderAccess } from '../../../actions/api';
import { setVolume } from '../../../actions/core';
import SelectUser from './modal/SelectUser';
import UsersTable from './UsersTable';
import { InputRow } from '../../forms/Material';
import { userContain } from '../../../helpers';



class GroupTable extends Component {
  static propTypes = {
    group: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
  }
  state = {

  }

  componentWillMount() {
    this.props.getUsers();

  }
  onSearch = (e) => {
    let keyword = e.target.value;
    this.setState({keyword});
  }

  filterUsers() {
    const {keyword} = this.state;
    const {userIds, users} = this.props;
    if (keyword && keyword.length>0) {
      return userIds.filter(id => userContain(users[id], keyword) )
    } else {
      return userIds;
    }
  }

  showAddModal = () => {
    this.setState({form: 'add_user'});
  }

  showSelectModal = () => {
    this.setState({form: 'select_user'});
  }

  closeModal = () => {
    this.setState({form: false});
  }

  selectUser = (user) => {
    const {volume, updateObject, group, setVolume, getUsers, onAddMember} = this.props;
    const meta = volume.meta;
    let members = (volume.meta && volume.meta.members) || {};
    let userIds = members[group] || [];
    if (!userIds.includes(user._id)) {
      let newAccessLevel=0; // default for "users"
      let depth="deep"; // default for "users"
      userIds.push(user._id);
      if (group === "managers") {
        newAccessLevel=1;
        depth="shallow";
      } else if (group === "editors") {
        newAccessLevel=1;
        depth="deep";
      }
      this.updateAccessList(volume, user, newAccessLevel, depth, members, group);
    }
    members[group] = [...userIds];
    meta.members = members;
    this.closeModal();
    return updateObject('folder', volume._id, volume.name, meta).then(res => {
      console.log(volume);
      setVolume({...volume});
      getUsers();
      if (onAddMember)
        return onAddMember(user);
    });
  }


  /**
   * updateAccessList() is a recursive function to check Girder access levels
   * and update those levels according to permissions set in the admin panel
   * and defined in the `members` JSON Object.
   * @param {Object} folder - Folder on which to update permissions
   * @param {Object} user - User for which to update permissions
   * @param {number} newAccessLevel - null for none, 0 for read, 1 for edit, 2 for own
   * @param {string} depth - "shallow" for just this Folder, "deep" for this Folder and its contents
   * @param {Object} members - admin-panel-defined access list
   * @param {string} group - "users", "editors", "managers", "owners"
   */
  updateAccessList = (folder, user, newAccessLevel, depth, members, group) => {
    const {getFolderAccess, updateFolderAccess} = this.props;
    let newAccessUsers = {};
    if (newAccessLevel !== null) { // increase access
      getFolderAccess(folder._id).then(accessList => {
        newAccessUsers = accessList.users.filter(userAccess => userAccess.id !== user._id);
        const thisUser = accessList.users.filter(userAccess => userAccess.id == user._id);
        newAccessUsers.push((!accessList.users.includes(user._id) || (newAccessLevel > thisUser[0].level)) ? {id: user._id, level: newAccessLevel} : thisUser);
        updateFolderAccess(folder._id, {users: newAccessUsers, groups: accessList.groups}, false);
      });
    } else { // reduce access
      getFolderAccess(folder._id).then(accessList => {
        const userTypes = {"users": 0, "editors": 1, "managers": 1, "owners": 2};
        newAccessUsers = accessList.users.filter(userAccess => userAccess.id !== user._id);
        accessList.users = newAccessUsers;
        let minimumAccess = null;
        for(const userType of Object.keys(userTypes)) {
          if (userType !== group) {
            if (members[userType] && members[userType].includes(user._id) && ((minimumAccess == null) || (userTypes[userType] > minimumAccess))) {
              minimumAccess = userTypes[userType];
            }
          }
        }
        if (minimumAccess !== null) {
          newAccessUsers.push({id: user._id, level: minimumAccess});
        }
        updateFolderAccess(folder._id, {users: newAccessUsers, groups: accessList.groups}, false);
      });
    }
  }

  handleDelete = (user) => {
    const {volume, updateObject, group, setVolume} = this.props;
    const meta = volume.meta;
    let members = (volume.meta && volume.meta.members) || {};
    let userIds = members[group]
    const index = userIds.indexOf(user._id);
    if (index>=0) {
      userIds.splice(index,1);

      this.updateAccessList(volume, user, null, null, members, group);
    }
    members[group] = [...userIds];
    meta.members = members;
    return updateObject('folder', volume._id, volume.name, meta).then(res => {
      console.log(volume);
      setVolume({...volume});
    });
  }

  render() {
    let {groupName, onSelect, withTitle} = this.props;

    const userIds = this.filterUsers();

    return (
      <div>
        <div className="search-box">
          <InputRow label={`Search ${groupName}s`}>&nbsp; &nbsp; <TextField type="name" placeholder="name or email" onChange={this.onSearch}/></InputRow>
        </div>
        { withTitle && <h4>{groupName}s</h4> }
        {userIds && <UsersTable userIds={userIds} onSelect={onSelect} onDelete={this.handleDelete} group={groupName}/> }
        <Button variant="contained" onClick={this.showAddModal}>Add {groupName}</Button>
        {" "}
        <Button variant="contained" onClick={this.showSelectModal}>Add Existing Member</Button>
        <AddUser
          show={this.state.form === 'add_user'} onClose={this.closeModal}
          groupName={groupName} role={groupName.toLowerCase()}
          onAdd={this.selectUser}
          />
        <SelectUser show={this.state.form === 'select_user'} exclude={this.props.userIds} onClose={this.closeModal} onSelect={this.selectUser} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  volume: state.entities.volume,
  userIds: state.entities.volume.meta.members && state.entities.volume.meta.members[ownProps.group],
  users: state.entities.users,
})

const mapDispatchToProps = {
  updateObject,
  setVolume,
  getUsers,
  getFolderAccess,
  updateFolderAccess,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupTable)
