import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';

class Editors extends Component {
  componentWillMount() {
    
  }
  
  render() {
    const { volume: {meta: data} } = this.props;

    return (
      <div>
        <h3>Manage {data.shortName} Editors</h3>
        <p className="pt-3">
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
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Editors)
