import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { updateObject } from '../../../actions/api';
import PagedTable from '../../layout/PagedTable';
import ConfirmDialog from '../../controls/ConfirmDialog';
import UserRow from './UserRow';

class UsersTable extends Component {
  static propTypes = {
    group: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    userIds: PropTypes.array,
  }
  state = {
    user: false,
    formDelete: false,
  }

  showDeleteConfirm = (user) => {
    this.setState({formDelete: true, user});
  }
  renderUser=(userId) => {
    const {onSelect} = this.props;
    return (<UserRow id={userId} key={userId} onSelect={onSelect} onDelete={this.showDeleteConfirm}/>)
  }

  renderConfirmDialog(){
    const {group, onDelete} = this.props;
    const {user, formDelete} = this.state;
    return (
      <ConfirmDialog
        show={formDelete}
        onClose={()=>this.setState({formDelete: false})}
        onClick={()=>onDelete(user)}>
        Are you SURE you want to remove the {group} {user.firstName} {user.lastName}({user.login})?
      </ConfirmDialog>)
  }

  render() {
    let {userIds} = this.props;
    
    return (
      <div>
      <PagedTable data={userIds} header={<TableRow>
            <TableCell>User</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell></TableCell>
            </TableRow>
        }
        row={this.renderUser}
        />
        {this.renderConfirmDialog()}
        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({

})

const mapDispatchToProps = {
  updateObject
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable)
