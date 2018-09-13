import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class Users extends Component {

  render() {
    const { volume } = this.props;
    let viewers = (volume.meta && volume.meta.viewers) || [];
    return (
      <div>
        <p>
          Manage {volume.meta.shortName} Viewers (and the Users whose data they view).
          <br/>
          Tap [+] on the left to add a Viewer. Tap any Viewer to edit or delete the Viewer.
          <br/>
          Tap in the Users column on the right to add or remove Users viewed by the Viewer.
        </p>
        
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  volume: state.entities.volume,
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
