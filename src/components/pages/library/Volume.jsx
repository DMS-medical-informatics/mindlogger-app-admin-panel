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
        console.log(res._id);
        return updateFolder(volume._id, name, {...data, logoImage: {name: res.name, '@id': `file/${res._id}`} });
      }).then(res => {
        setVolume(res);
        this.close(res);
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
    const {volume, user} = this.props;

    let {viewers, managers, editors} = volume && volume.meta && volume.meta.members || {};
    let canView = false;
    let canManage = false;
    let canEdit = false;

    canView = viewers && Object.keys(viewers).includes(user._id)
    canManage = managers && managers.includes(user._id)
    canEdit = editors && editors.includes(user._id);

    if (!volume)
      return (<div></div>)
    return (
      <div>
        <Grid container spacing={16}>
          <Grid item>
            <h2>{volume.name}</h2>
            <p>{volume.meta.description}</p>
            { canManage && 
              <Button variant="contained" onClick={() => this.setState({form: true})}>Edit</Button>
            }
            {this.renderEditVolumeModal()}
            <br/>
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item>
            <h3>Actions</h3>
            <p>You can do more actions by clicking menu on top</p>
            { canEdit && <Button variant="outlined" color="primary" onClick={this.onEditActivity}>Edit Activities</Button> }
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

const mapStateToProps = ({entities: {folder, volume, self}}, ownProps) => ({
  volumes: folder.volumes,
  volume,
  volumeIndex: ownProps.match.params.id,
  user: self,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Volume);