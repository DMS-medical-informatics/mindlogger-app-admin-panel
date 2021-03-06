import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Modal from '@material-ui/core/Modal';
import PagedTable from '../../../layout/PagedTable';
import { userContain } from '../../../../helpers';
import PadBlock from '../../../layout/PadBlock';

class SelectUser extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    users: {}
  }

  state = {
    order: 'asc',
    orderBy: 'calories',
    page: 0,
    rowsPerPage: 5,
  }

  componentWillMount() {
    this.updateUserList(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateUserList(nextProps);
  }

  updateUserList(props) {
    const {users, exclude} = props;
    let keys = Object.keys(users);
    if (exclude !== undefined) {
      keys = keys.filter( key => !exclude.includes(key));
    }
    this.setState({keys});
  }

  renderUser = (key) => {
    const {users, userIds} = this.props;
    let user = users[key];
   return (<TableRow
          key={key}
          hover
          onClick={()=>this.props.onSelect(user)}
          selected={userIds && userIds.includes(key)}
          >
          <TableCell component="th" scope="row">
            {user.login}
          </TableCell>
          <TableCell>{user.firstName} {user.lastName}</TableCell>
          <TableCell>{user.email}</TableCell>
        </TableRow>)
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  filterUsers() {
    const { users } = this.props;
    const {keyword, keys} = this.state;
    if (keyword && keyword.length>0)
      return keys.filter(id => userContain(users[id], keyword));
    else
      return keys;
  }

  onSearch = (e) => {
    let keyword = e.target.value.toLowerCase();
    this.setState({keyword});
  }

  render() {
    const {show, onClose} = this.props;
    console.log(this.props.users);
    //const { keys } = this.state;
    return (
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={show}
          onClose={onClose}
        >
      <Paper className="modal-table">
        <h3>Select User</h3>
        <PadBlock padding={0.6}>
        <TextField className="searchText" onChange={this.onSearch} placeholder="Search"/>
        </PadBlock>
        <PagedTable data={this.filterUsers()} header={<TableRow>
            <TableCell>User</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            </TableRow>
        }
        row={this.renderUser}
        />
      </Paper>
      </Modal>

  );
  }
}

const mapStateToProps = (state) => ({
  users: state.entities.users
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUser)
