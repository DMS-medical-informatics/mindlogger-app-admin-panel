import React, { Component } from 'react'
import { connect } from 'react-redux'
import GroupTable from './GroupTable';

class Managers extends Component {

  render() {
    const { volume: {meta: data}, name } = this.props;

    return (
      <div>
        <h3>Manage {data.shortName || name} Managers</h3>
        <p className="pt-3">
          Here you can add, edit, or remove Managers of the {data.shortName || name} Activity Set.
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

}

export default connect(mapStateToProps, mapDispatchToProps)(Managers)
