import React, { Component } from 'react'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';
import { addFolder, copyObject } from '../../../actions/api';
import ViewersByUser from './users/ViewersByUser';
import Grid from '@material-ui/core/Grid/Grid';

class Users extends Component {
  state = {}

  handleMember = (user) => {
    const { addFolder, copyObject, volume } = this.props;
    return addFolder('Volumes', {}, user._id, 'user').then(folder => {
      return copyObject(volume._id, 'folder', folder._id, 'folder');
    })
  }

  viewersByUser(userId){
    const {userDict} = this.props;
    const viewers = [];
    for(let id in userDict) {
      if (userDict[id].includes(userId)) {
        viewers.push(id);
      }
    }
    return viewers;
  }

  onSelect = (user) => {
    this.setState({user});
  }

  render() {
    const { volume: {meta: data} } = this.props;
    const {user} = this.state;
    return (
      <div>
        <h3>Manage {data.shortName} Users</h3>
        <p className="pt-3">
          Here you can add, edit, or remove Users of the {data.shortName} Activity Set, and view who are the Viewers of their data.
          <br/>
          Users perform Activities in the App, and Viewers can view their data in a Dashboard.
          <br/>
          Tap on a row to see who are the Viewers for that User.
        </p>
        <Grid container>
          <Grid item xs={9}>
            <GroupTable group='users' groupName='User' withTitle onAddMember={this.handleMember} onSelect={this.onSelect}/>
          </Grid>
          <Grid item xs={3} className="viewers-by-user__container">
            { user && <ViewersByUser key={user._id} user={user} selected={this.viewersByUser(user._id)} userIds={data.members && data.members.users} onCancel={() => this.setState({user:undefined})} /> }
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = ({entities: {volume}}) => ({
  volume,
  userDict: (volume.meta.members && volume.meta.members.viewers) || {},
})

const mapDispatchToProps = {
  copyObject,
  addFolder,
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
