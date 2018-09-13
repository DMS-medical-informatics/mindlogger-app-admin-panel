import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getObject } from '../../../actions/api';

class UserRow extends Component {
  
  render() {
    const {user} = this.props;
    if (user) {
      return (
        <tr>
          <td>{user.login}</td>
          <td>{user.firstName} {user.lastName}</td>
          <td>{user.email}</td>
        </tr>
      )
    } else {
      return (<tr></tr>)
    }
    
    
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.users && state.entities.users[ownProps.id]
})

const mapDispatchToProps = {
  getObject
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRow)
