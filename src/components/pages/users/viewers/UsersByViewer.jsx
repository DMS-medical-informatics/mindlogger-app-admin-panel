import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import PagedTable from '../../../layout/PagedTable';
import { userContain } from '../../../../helpers';
import PadBlock from '../../../layout/PadBlock';
import AddUsersByViewer from './AddUsersByViewer';

class UsersByViewer extends Component {
  static propTypes = {
    selected: PropTypes.array.isRequired,
    userIds: PropTypes.array.isRequired,
  }

  state = {
    show: false
  }

  componentWillMount() {
    this.updateSelection(this.props);
  }

  componentWillReceiveProps(nextProps) {
  }

  updateSelection(props) {
    let {selected} = props;
    
    this.setState({selected});
  }

  handleClick = (id) => {

  }

  handleDelete = (id) => {
    let { selected } = this.state;
    const selectedIndex = selected.indexOf(id);

    if (selectedIndex >= 0) {
      selected.splice(selectedIndex, 1);
    }
    this.setState({ selected });
  };

  onSearch = (e) => {
    let keyword = e.target.value.toLowerCase();
    this.setState({keyword});
  }

  filterUsers() {
    const { users } = this.props;
    const { keyword, selected} = this.state;
    if (keyword && keyword.length>0)
      return selected.filter(id => userContain(users[id], keyword));
    else
      return selected;
  }

  onAddUsers = (ids) => {
    let {selected} = this.state;
    selected = selected.concat(ids);
    this.setState({selected, show: false});
  }

  renderModal() {
    const {userIds} = this.props;
    return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={this.state.show}
      onClose={this.onClose}
    >
      <Paper className="modal-paper">
        <AddUsersByViewer onAddUsers={this.onAddUsers} userIds = {userIds} excludeIds={this.state.selected} onCancel={this.onClose}/>
      </Paper>
    </Modal>);
  }

  onShowAdd = () => {
    this.setState({show: true});
  }

  onClose = () => {
    this.setState({show: false});
  }


  render() {
    const { users, onSelectUsers, onCancel, viewer } = this.props;
    const {selected} = this.state;
    // const numSelected = selected.length;
    // const rowCount = userIds.length;
    const filteredIds = this.filterUsers();
    return (<div className="users-by-viewer">
      <h4 className="text-center">Select users for {viewer.firstName} {viewer.lastName}</h4>
      <PadBlock>
        <TextField className="searchText" onChange={this.onSearch} placeholder="Search"/>
      </PadBlock>
      <PagedTable rowsPerPage={25} data={filteredIds} header={
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell><Button onClick={this.onShowAdd}><AddIcon/></Button></TableCell>
      </TableRow>
      } row={(id) => 
      <TableRow key={id} onClick={() => this.handleClick(id)}>
        <TableCell>{users[id].firstName} {users[id].lastName}({users[id].login})</TableCell>
        <TableCell><Button onClick={() => this.handleDelete(id)}><RemoveIcon /></Button></TableCell>
      </TableRow>} />
        <center>
          <Button variant="outlined" onClick={() => onSelectUsers(selected)}>Submit</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </center>
      {this.renderModal()}
      </div>
      )
  }
}

const mapStateToProps = (state) => ({
  users: state.entities.users
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersByViewer)

