import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUsers } from '../../../actions/api';
import GroupTable from './GroupTable';

class Managers extends Component {
  componentWillMount() {
    this.props.getUsers();
  }
  
  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div>
        <p>
          Manage {data.shortName} Managers (and the Managers whose data they view).
          <br/>
          Tap [+] on the left to add a Viewer. Tap any Viewer to edit or delete the Viewer.
          <br/>
          Tap in the Managers column on the right to add or remove Managers viewed by the Viewer.
        </p>
        <GroupTable group='managers' groupName='Managers' />
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

export default connect(mapStateToProps, mapDispatchToProps)(Managers)
