import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';
import { getUsers } from '../../../actions/api';
import { setPageTitle } from '../../../actions/core';

class Editors extends Component {
  componentWillMount() {
    const { volume: {meta: data}, getUsers, setPageTitle } = this.props;
    getUsers();
    setPageTitle(`Manage ${data.shortName} Editors`);
  }
  
  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div>
        <p>
        Here you can add, edit, or delete Editors of the ETA Activity Set.
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
  getUsers,
  setPageTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(Editors)
