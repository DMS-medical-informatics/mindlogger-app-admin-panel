import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormControl, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

import UserRow from './UserRow';
import AddUser from './modal/AddUser';
import { updateObject, getUsers } from '../../../actions/api';
import { setVolume } from '../../../actions/core';
import SelectUser from './modal/SelectUser';
import UsersTable from './UsersTable';
import UsersByViewer from './viewers/UsersByViewer';
import Grid from '@material-ui/core/Grid';
import PagedTable from '../../layout/PagedTable';



const userContain = (user, keyword) => 
  {
    return user && 
  (user.firstName.includes(keyword) || user.lastName.includes(keyword) || user.email.includes(keyword))
  }
class Viewers extends Component {

  componentWillMount() {
    this.props.getUsers();
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
    const {volume, updateObject, group, setVolume} = this.props;
    let meta = volume.meta;
    let userDict = {...meta.members.viewers};
    userDict[user._id] = [];
    meta.members.viewers = userDict;
    volume.meta = meta;
    return updateObject('folder', volume._id, volume.name, meta).then(res => {
      setVolume({...volume});
      this.closeModal();
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
        <p>
          Manage {data.shortName} Viewers (and the Users whose data they view).
          <br/>
          Tap [+] on the left to add a Viewer. Tap any Viewer to edit or delete the Viewer.
          <br/>
          Tap in the Users column on the right to add or remove Users viewed by the Viewer.
        </p>
        <div className="search-box">
          <Row>
            <Col sm={3}> Search Viewers: </Col>
            <Col sm={9}><FormControl type="name" placeholder="name or email" onChange={this.onSearch}/></Col>
          </Row>
        </div>
        <Grid container>
          <Grid item xs={9}>
            <UsersTable userIds = {userIds} onSelect={this.onSelect}/>
            <Button variant="contained" onClick={this.showAddModal}>Add Viewer</Button>
            {" "}
            <Button variant="contained" onClick={this.showSelectModal}>Add Existing User</Button>
          </Grid>
          <Grid item xs={3}>
            { user && <UsersByViewer key={user._id} selected={userDict[user._id]} userIds={data.members && data.members.users} onSelectUsers={this.onSelectUsers} onCancel={() => this.setState({user:undefined})} /> }
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
  userDict: state.entities.volume.meta.members && state.entities.volume.meta.members.viewers,
})

const mapDispatchToProps = {
  getUsers,
  updateObject,
  setVolume,
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewers)
