import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import PagedTable from '../../../layout/PagedTable';

class UsersByViewer extends Component {
  static propTypes = {
    selected: PropTypes.array.isRequired,
    userIds: PropTypes.array.isRequired,
  }

  state = {
    
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
  handleSelectAllClick = event => {
    const {userIds} = this.props;
    if (event.target.checked) {
      this.setState(state => ({ selected: userIds }));
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

  render() {
    const { users, onSelectUsers, userIds, onCancel } = this.props;
    const {selected} = this.state;
    const numSelected = selected.length;
    const rowCount = userIds.length;
    return (<div className="users-by-viewer">
      <PagedTable rowsPerPage={25} data={userIds} header={
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
        <TableCell>{users[id].firstName} {users[id].lastName}</TableCell></TableRow>} />
        <center>
          <Button variant="outlined" onClick={() => onSelectUsers(selected)}>Select</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersByViewer)

