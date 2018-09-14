import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';
import { getUsers } from '../../../actions/api';

class Editors extends Component {
  componentWillMount() {
    this.props.getUsers();
  }
  
  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div>
        <p>
          Manage {data.shortName} Editors.
          <br/>
          Tap [+] on the left to add a Viewer. Tap any Viewer to edit or delete the Viewer.
          <br/>
        </p>
        <GroupTable group='editors' groupName='Editor' />
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

export default connect(mapStateToProps, mapDispatchToProps)(Editors)
