import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { FormControl, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import AddUser from './modal/AddUser';
import { updateObject } from '../../../actions/api';
import SelectUser from './modal/SelectUser';
import PagedTable from '../../layout/PagedTable';
import UserRow from './UserRow';

class UsersTable extends Component {

  state = {

  }

  renderUser=(userId) => {
    const {onSelect, onDelete} = this.props;
    return (<UserRow id={userId} key={userId} onSelect={onSelect} onDelete={onDelete}/>)
  }

  render() {
    let {userIds} = this.props;
    
    return (
      
      <PagedTable data={userIds} header={<TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell></TableCell>
            </TableRow>
        }
        row={this.renderUser}
        />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({

})

const mapDispatchToProps = {
  updateObject
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable)
