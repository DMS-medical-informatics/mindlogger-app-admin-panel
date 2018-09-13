import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UsersTable from './UsersTable';
import { getUsers } from '../../../actions/api';

class Viewers extends Component {
  componentWillMount() {
    this.props.getUsers();
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
        <UsersTable group='users' groupName='User' />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  volume: state.entities.volume,
})

const mapDispatchToProps = {
  getUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewers)
