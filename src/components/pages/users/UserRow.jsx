import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getObject } from '../../../actions/api';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class UserRow extends Component {
  
  render() {
    const {user, onSelect} = this.props;
    if (user) {
      return (
        <TableRow hover onClick={() => onSelect(user)}>
          <TableCell>{user.login}</TableCell>
          <TableCell>{user.firstName} {user.lastName}</TableCell>
          <TableCell>{user.email}</TableCell>
        </TableRow>
      )
    } else {
      return (<TableRow></TableRow>)
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
