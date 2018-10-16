import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';
import { setPageTitle } from '../../../actions/core';

class Editors extends Component {
  componentWillMount() {
    const { volume: {meta: data}, setPageTitle } = this.props;
    setPageTitle(`Manage ${data.shortName} Editors`);
  }
  
  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div className="pt-3">
        <p>
        Here you can add, edit, or remove Editors of the ETA Activity Set.
        <br/>
        Editors can edit the content and settings for each Activity.
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
  setPageTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(Editors)
