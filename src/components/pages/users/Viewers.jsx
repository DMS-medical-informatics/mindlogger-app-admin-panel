import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormControl, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import AddUser from './modal/AddUser';
import { updateObject, getUsers } from '../../../actions/api';
import { setVolume } from '../../../actions/core';
import SelectUser from './modal/SelectUser';
import UsersTable from './UsersTable';
import UsersByViewer from './viewers/UsersByViewer';
import Grid from '@material-ui/core/Grid';
import PagedTable from '../../layout/PagedTable';
import { InputRow } from '../../forms/Material';
import { userContain } from '../../../helpers';

class Viewers extends Component {

  componentWillMount() {
    const { getUsers } = this.props;
    getUsers();
  }
  state = {

  }
  onSearch = (e) => {
    let keyword = e.target.value;
    this.setState({keyword});
  }

  filterUsers() {
    const {keyword} = this.state;
    const {userDict, users} = this.props;
    const userIds = Object.keys(userDict);
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
    let {volume, updateObject, group, setVolume, getUsers} = this.props;
    let meta = volume.meta;
    let userDict = {...this.props.userDict};
    userDict[user._id] = [];
    meta.members.viewers = userDict;
    
    volume.meta = meta;
    return updateObject('folder', volume._id, volume.name, meta).then(res => {
      setVolume({...volume});
      getUsers();
      this.closeModal();
    });
  }

  handleDelete = (user) => {
    const {volume, updateObject, group, setVolume} = this.props;
    const meta = volume.meta;
    let userDict = {...this.props.userDict};
    delete userDict[user._id];
    meta.members.viewers = userDict;
    meta.members.viewers = userDict;
    volume.meta = meta;
    return updateObject('folder', volume._id, volume.name, meta).then(res => {
      setVolume({...volume});
    });
  }

  onSelectUsers = (userIds) => {
    const {volume, updateObject, setVolume} = this.props;
    let meta = volume.meta;
    let userDict = {...meta.members.viewers};
    userDict[this.state.user._id] = userIds;
    meta.members.viewers = userDict;
    volume.meta = meta;
    this.setState({user:undefined});
    return updateObject('folder', volume._id, volume.name, meta).then(res => {
      setVolume({...volume});
    });
  }

  onSelect = (user) => {
    this.setState({user});
  }

  renderUsersByViewer() {
    
  }
  render() {
    const { volume: {meta: data}, userDict } = this.props;
    const { user } = this.state;
    const userIds = this.filterUsers();
    return (
      <div>
        <h3>Manage {data.shortName} Viewers</h3>
        <p className="pt-3">
          Here you can add, edit, or remove Viewers of ETA Activity Set data, and add or remove Users whose data they view.
          <br/>
          Users perform Activities in the App, and Viewers can view their data in a Dashboard.
          <br/>
          Tap on a row to add or remove Users viewed by that Viewer.
        </p>
        <div className="search-box">
          <InputRow label={`Search Viewers`}>&nbsp; &nbsp; <TextField type="name" placeholder="name or email" onChange={this.onSearch}/></InputRow>
        </div>
        <Grid container>
          <Grid item xs={9}>
            <h4>Viewers</h4>
            <UsersTable userIds = {userIds} onSelect={this.onSelect} onDelete={this.handleDelete} group="Viewer"/>
            <Button variant="contained" onClick={this.showAddModal}>Add Viewer</Button>
            {" "}
            <Button variant="contained" onClick={this.showSelectModal}>Add Existing Member</Button>
          </Grid>
          <Grid item xs={3} className="users-by-viewer--container">
            { user && <UsersByViewer key={user._id} viewer={user} selected={userDict[user._id]} userIds={data.members && data.members.users} onSelectUsers={this.onSelectUsers} onCancel={() => this.setState({user:undefined})} /> }
          </Grid>
        </Grid>
        <AddUser
          show={this.state.form === 'add_user'} onClose={this.closeModal}
          groupName='Viewer' role='viewer'
          onAdd={this.selectUser}
          />
        <SelectUser show={this.state.form === 'select_user'} exclude={userIds} onClose={this.closeModal} onSelect={this.selectUser} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  volume: state.entities.volume,
  users: state.entities.users,
  userDict: state.entities.volume.meta.members && state.entities.volume.meta.members.viewers || {},
})

const mapDispatchToProps = {
  getUsers,
  updateObject,
  setVolume,
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewers)
