import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getObject } from '../../../actions/api';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button/Button';
import ClearIcon from '@material-ui/icons/Clear';


class UserRow extends Component {
  
  render() {
    const {user, onSelect, onDelete} = this.props;
    if (user) {
      return (
        <TableRow hover>
          <TableCell onClick={() => onSelect && onSelect(user)}>{user.login}</TableCell>
          <TableCell onClick={() => onSelect && onSelect(user)}>{user.firstName} {user.lastName}</TableCell>
          <TableCell onClick={() => onSelect && onSelect(user)}>{user.email}</TableCell>
          <TableCell><Button onClick={() => onDelete && onDelete(user)}><ClearIcon /></Button></TableCell>
        </TableRow>
      )
    } else {
      return (<TableRow></TableRow>)
    }
    
    
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: (state.entities.users && state.entities.users[ownProps.id]) || {_id: ownProps.id}
})

const mapDispatchToProps = {
  getObject
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRow)
