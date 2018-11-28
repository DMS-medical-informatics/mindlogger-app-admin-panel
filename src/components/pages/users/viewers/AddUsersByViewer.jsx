import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import PagedTable from '../../../layout/PagedTable';
import { userContain } from '../../../../helpers';
import PadBlock from '../../../layout/PadBlock';

class AddUsersByViewer extends Component {
  static propTypes = {
    excludeIds: PropTypes.array.isRequired,
    userIds: PropTypes.array.isRequired,
  }

  state = {
    selected:[],
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: this.filterUsers() }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (id) => {
    let { selected } = this.state;
    const selectedIndex = selected.indexOf(id);

    if (selectedIndex < 0) {
      selected.push(id);
    } else {
      selected.splice(selectedIndex, 1);
    }

    console.log(selected);

    this.setState({ selected });
  };

  onSearch = (e) => {
    let keyword = e.target.value.toLowerCase();
    this.setState({keyword});
  }

  filterUsers() {
    const { userIds, users, excludeIds } = this.props;
    const {keyword} = this.state;
    let ids = excludeIds ? userIds.filter( id => !excludeIds.includes(id)) : userIds;
    if (keyword && keyword.length>0)
      return ids.filter(id => userContain(users[id], keyword));
    else
      return ids;
  }

  render() {
    const { users, onAddUsers, userIds, onCancel } = this.props;
    const {selected} = this.state;
    const numSelected = selected.length;
    const rowCount = userIds.length;
    const filteredIds = this.filterUsers();
    return (<div className="add-users-by-viewer">
      <PadBlock>
        <TextField className="searchText" onChange={this.onSearch} placeholder="Search"/>
      </PadBlock>
      <PagedTable className="table-wrapper" rowsPerPage={25} data={filteredIds} header={
      <TableRow><TableCell padding="checkbox"><Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={this.handleSelectAllClick}
          /></TableCell><TableCell>Name</TableCell></TableRow>
      } row={(id) => <TableRow key={id} onClick={() => this.handleClick(id)}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected.includes(id)}
          />
        </TableCell>
        <TableCell>{users[id].firstName} {users[id].lastName}({users[id].login})</TableCell></TableRow>} />
        <center>
          <Button variant="outlined" onClick={() => onAddUsers(selected)}>Select</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </center>
      </div>
      )
  }
}

const mapStateToProps = (state) => ({
  users: state.entities.users
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUsersByViewer)

