import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UsersTable from './UsersTable';
import { getUsers } from '../../../actions/api';

class Viewers extends Component {
  componentWillMount() {
    this.props.getUsers();
  }
  
  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div>
        <p>
          Manage {data.shortName} Viewers (and the Users whose data they view).
          <br/>
          Tap [+] on the left to add a Viewer. Tap any Viewer to edit or delete the Viewer.
          <br/>
          Tap in the Users column on the right to add or remove Users viewed by the Viewer.
        </p>
        <UsersTable group='viewers' groupName='Viewer' />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  volume: state.entities.volume,
})

const mapDispatchToProps = {
  getUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewers)
