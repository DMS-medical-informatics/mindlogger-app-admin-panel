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

import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { getPath } from '../../../actions/api';
import LButton from '../../controls/LButton';

class Volume extends Component {

  static propTypes = {
    onEdit: PropTypes.func,
    onAdd: PropTypes.func,
    group: PropTypes.object,
  }

  state = {

  }

  componentWillMount() {
//    const {group:{_id:parentId, name}, getPath} = this.props;

/*    getPath('folder', {parentId, parentType: 'folder'}).then(acts => {
      let info;
      let consent;
      acts.forEach(act => {
        if(act.meta && act.meta.info) {
          info = act;
        } else if(act.meta && act.meta.consent) {
          consent = act;
        }
      });
      this.setState({info, consent});
    });
*/
    const {volumes, volumeId, setVolume} = this.props;
    const volume = volumes.find(v => v._id === volumeId);
    setVolume(volume);
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
// @rno: this.props twice
    const {group, name, onEdit, onAdd} = this.props;
    const {info, consent} = this.state;

/*    const infoButton = (info ?
      <LButton onClick={() => onEdit(info, true)}>{info.name}</LButton>
      : <Button onClick={() => onAdd('info')}><AddIcon /></Button>);
*/

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
            <h3>Activity Set "{volume.name}"</h3>
            <p>Description: {volume.meta.description}</p>
            { canEdit && 
              <Button variant="contained" onClick={() => this.setState({form: true})}>Edit Description</Button>
            }
            {this.renderEditVolumeModal()}
            <br/><br/>
            { /*canEdit &&
              {infoButton}*/
            }

            {this.renderEditVolumeModal()}
            <p className="pt-3">See "{volume.name} Menu" for Managers, Editors, Users, or Viewers of this Activity Set.</p>
          </Grid>
        </Grid>

        { canEdit &&
          <Grid container spacing={16}>
            <Grid item>
              <h3>Edit Activities</h3>
              <p>Here you can {info ? 'edit' : 'add'} Activities and their Information sections to "{volume.name}".
              <br/>
              Tap on a <AddIcon /> to add a new Activity or new Information screens. </p>
            </Grid>
          </Grid>
        }

      </div>
    );
  }
}
const mapDispatchToProps = {
  getPath,
  setVolume,
  updateFolder,
  uploadFile,
};

const mapStateToProps = ({entities: {folder, volume, self}}, ownProps) => ({
  volumes: folder.volumes,
  volume,
  volumeId: ownProps.match.params.id,
  user: self,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Volume);
