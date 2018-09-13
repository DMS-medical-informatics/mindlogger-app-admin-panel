import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UserRow from './UserRow';
import { FormControl, Row, Col } from 'react-bootstrap';

const userContain = (user, keyword) => 
  {
    return user && 
  (user.firstName.includes(keyword) || user.lastName.includes(keyword) || user.email.includes(keyword))
  }


class UsersTable extends Component {
  static propTypes = {
    group: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
  }
  state = {

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

  render() {
    let {groupName} = this.props;
    
    const userIds = this.filterUsers();
    
    return (
      <div>
        <div className="search-box">
        <Row>
          <Col sm={3}> Search {groupName}s: </Col>
          <Col sm={9}><FormControl type="name" placeholder="name or email" onChange={this.onSearch}/></Col>
        </Row>
        </div>
        <table className="users-table">
          <thead>
            <tr>
              <th>{groupName} [+]</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
          { userIds.map(id => <UserRow id={id} key={id} /> ) }
          </tbody>
        </table>
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
  
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable)
