import React, { Component } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { setVolume } from "../../../actions/core";
import { updateFolder, uploadFile } from "../../../actions/api";
import VolumeForm from "./VolumeForm";
class Volume extends Component {

  componentWillMount() {
    const {volumes, volumeIndex, setVolume} = this.props;
    setVolume(volumes[volumeIndex]);
    this.setState({});
  }

  onEditVolume = ({name, logo, ...data}) => {
    const {volume, updateFolder, uploadFile, setVolume} = this.props;
    if(logo && Array.isArray(logo) && logo.length > 0) {
      let fileObject = logo[0];
      return uploadFile(fileObject.name, fileObject, 'folder', volume._id).then(res => {
        return updateFolder(volume._id, name, {...data, logoImage: {name: res.name, '@id': `file/${res._id}`} });
      }).then(res => {
        setVolume(res);
      });
    } else {
      const {_id, logoImage} = volume;
      return updateFolder(_id, name, {...data, logoImage}).then(res => {
        this.close();
        setVolume(res);
      });
    }
  };

  close = e => {
    this.setState({ form: false });
  };

  renderEditVolumeModal = () => {
    const {volume} = this.props;
    let {name, meta} = volume;
    return (
      <Modal show={this.state.form} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Volume</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <VolumeForm onSubmit={this.onEditVolume} updating initialValues={{name, ...meta}}/>
        </Modal.Body>
      </Modal>
    );
  };
  onEditActivity = () => {
    this.props.history.push("/acts");
  }
  render() {
    const {volume} = this.props;
    if (!volume)
      return (<div></div>)
    return (
      <div>
        <Grid container spacing={16}>
          <Grid item>
            <h2>{volume.name}</h2>
            <p>{volume.meta.description}</p>
            <Button variant="contained" onClick={() => this.setState({form: true})}>Edit</Button>
            {this.renderEditVolumeModal()}
            <br/>
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item>
            <h3>Actions</h3>
            <p>You can do more actions by clicking menu on top</p>
            <Button variant="outlined" color="primary" onClick={this.onEditActivity}>Edit Activities</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
const mapDispatchToProps = {
  setVolume,
  updateFolder,
  uploadFile,
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