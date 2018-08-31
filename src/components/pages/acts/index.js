import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { withRouter } from "react-router";

import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import { Modal } from 'react-bootstrap';

import ActGroup from './ActGroup';
import { getFolders, addFolder, getObject } from "../../../actions/api";
import { setDataObject } from "../../../actions/core";
import { InputRow } from '../../forms/Material';
import AddActForm from './AddObjectForm';

const mapStateToProps = (state, ownProps) => ({
  volume: state.entities.volume,
  groups: state.entities.folder.groups || [],
  acts: state.entities.folder.acts
});

const mapDispatchToProps = {
  getFolders,
  addFolder,
  setDataObject,
  getObject
};

class Acts extends Component {
  state = {
    open: false,
  };

  componentWillMount() {
    const {getFolders, volume, getObject, acts} = this.props;
    (volume.meta && volume.meta.information && volume.meta.information["@id"]) ? getObject(...volume.meta.information["@id"].split('/')).then(res => {
      volume.info = res;
    }) : null;
    (volume.meta && volume.meta.consent && volume.meta.consent["@id"]) ? getObject(...volume.meta.consent["@id"].split('/')).then(res => {
      volume.consent = res;
    }) : null;
    getFolders(volume._id, 'groups', 'folder').then(res => {
      if (res.length === 0) {
        return this.createDefaultGroups();
      }
    });
  }

  handleListItemClick(obj) {
    const {setDataObject, history} = this.props;
    setDataObject(obj);
    history.push(`/acts/${obj._id}/edit`);
  }

  handleAddClick(obj) {
    this.setState({open: 'add_variant'})
  }

  handleClose = () => {
    this.setState({open: false});
  }

  onEdit = (folder) => {
    const {getFolders} = this.props;
    this.setState({open: 'select'});
    this.groupId = folder._id;
    getFolders(folder._id, 'acts', 'folder').then(res => {
       this.handleListItemClick(this.props.acts.latest);
    });
    this.handleListItemClick(folder);
  }

  onAddAct = (group) => {
    this.groupId = group._id;
    this.setState({open: 'add'});
  }

  renderAddActDialog() {
    return (<Modal show={this.state.open === 'add'} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddActForm onSubmit={this.handleSubmitAct} />
      </Modal.Body>
    </Modal>)
  }

  renderAddActVariantDialog() {
    return (<Modal show={this.state.open === 'add_variant'} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add activity version</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddActForm onSubmit={this.handleSubmitActVariant} />
      </Modal.Body>
    </Modal>)
  }

  handleSubmitAct = ({name}) => {
    const {addFolder} = this.props;
    return addFolder(name, {}, this.groupId, 'folder').then(res => {
      return addFolder(name, {}, res._id, 'folder', false).then(obj => {
        this.handleListItemClick(obj);
      })
    });
  }

  handleSubmitActVariant = ({name}) => {
    const {addFolder} = this.props;
    return addFolder(name, {}, this.groupId, 'folder').then(res => {
      this.handleClose();
    });
  }

  createDefaultGroups() {
    const {addFolder, getFolders, volume} = this.props;
    return addFolder('Activities',{},volume._id, 'folder').then(res => {
      return getFolders(volume._id, 'groups', 'folder');
    });
  }

  render() {
    const {volume, groups, acts} = this.props;
    acts.latest = acts.length ? acts.sort((a, b) => new Date(b.updated) - new Date(a.updated))[0] : null;
    return (
      <div>
      <p>Edit the {volume.meta && volume.meta.shortName} Volume’s Information, Consent, and Activities, and each Activity’s Instructions. Tap [+] to add an entry, and tap any entry to edit or delete.</p>
      <Grid container spacing={8} justify="space-between">
        {
          groups.map((group,idx) =>
          <ActGroup group={group} key={group._id} onEdit={this.onEdit} onAdd={this.onAddAct} vol={volume} />)
        }
      </Grid>
      { this.renderAddActDialog() }
      { this.renderAddActVariantDialog() }
      </div>
    );
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Acts);
