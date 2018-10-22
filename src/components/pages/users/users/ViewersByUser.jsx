import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import PagedTable from '../../../layout/PagedTable';
import { userContain } from '../../../../helpers';
import PadBlock from '../../../layout/PadBlock';
import AddUsersByViewer from './AddUsersByViewer';

class ViewersByUser extends Component {
  static propTypes = {
    selected: PropTypes.array.isRequired,
    userIds: PropTypes.array.isRequired,
  }

  state = {
    show: false
  }

  onSearch = (e) => {
    let keyword = e.target.value.toLowerCase();
    this.setState({keyword});
  }

  filterUsers() {
    const { users, selected } = this.props;
    const { keyword } = this.state;
    if (keyword && keyword.length>0)
      return selected.filter(id => userContain(users[id], keyword));
    else
      return selected;
  }


  render() {
    const { users, onSelectUsers, userIds, onCancel, user, selected } = this.props;
    const numSelected = selected.length;
    const rowCount = userIds.length;
    const filteredIds = this.filterUsers();
    return (<div className="users-by-viewer">
      <h4 className="text-center">Viewers for {user.firstName} {user.lastName}</h4>
      <PadBlock>
        <TextField className="searchText" onChange={this.onSearch} placeholder="Search"/>
      </PadBlock>
      <PagedTable rowsPerPage={25} data={filteredIds} header={
      <TableRow>
        <TableCell>Name</TableCell>
      </TableRow>
      } row={(id) => 
      <TableRow key={id} onClick={() => this.handleClick(id)}>
        <TableCell>{users[id].firstName} {users[id].lastName}({users[id].login})</TableCell>
      </TableRow>} />
      </div>
      )
  }
}

const mapStateToProps = (state) => ({
  users: state.entities.users
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewersByUser)

