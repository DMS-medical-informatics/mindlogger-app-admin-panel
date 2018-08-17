import React, { Component } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { setVolume } from "../../../actions/core";

class Volume extends Component {

  componentWillMount() {
    const {volumes, volumeIndex, setVolume} = this.props;
    setVolume(volumes[volumeIndex]);
  }


  render() {
    const {volume} = this.props;
    if (!volume)
      return (<div></div>)
    return (
      <div>
        <h2>{volume.name}</h2>
        <p>{volume.meta.description}</p>
      </div>
    );
  }
}
const mapDispatchToProps = {
  setVolume
};

const mapStateToProps = (state, ownProps) => ({
  volumes: state.entities.folder.volumes,
  volume: state.entities.volume,
  volumeIndex: ownProps.match.params.id,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Volume);