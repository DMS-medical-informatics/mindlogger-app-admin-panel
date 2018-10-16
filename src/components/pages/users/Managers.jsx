import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setPageTitle } from '../../../actions/core';
import GroupTable from './GroupTable';

class Managers extends Component {
  componentWillMount() {
    const { volume: {meta: data}, setPageTitle } = this.props;
    setPageTitle(`Manage ${data.shortName} Managers`);
  }
  
  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div className="pt-3">
        <p>
          Here you can add, edit, or remove Managers of the ETA Activity Set.
          <br/>
          Managers control who can be Users, Viewers, Editors, and other Managers.
        </p>
        <GroupTable group='managers' groupName='Manager' />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  volume: state.entities.volume,
})

const mapDispatchToProps = {
  setPageTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(Managers)
