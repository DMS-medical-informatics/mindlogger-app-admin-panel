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

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import MultipleSelect from './MultipleSelect';

import { Modal } from 'react-bootstrap';

import ActGroup from '../ActGroup';
import { getFolders, addFolder, getObject } from "../../../../actions/api";
import { setDataObject } from "../../../../actions/core";
import { InputRow } from '../../../forms/Material';
import AddActForm from '../AddObjectForm';

const mapStateToProps = (state, ownProps) => ({
  volume: state.entities.volume,
  groups: state.entities.folder.groups || [],
  acts: state.entities.folder.acts,
  volumes: state.entities.folder.volumes
});

const mapDispatchToProps = {
  getFolders,
  addFolder,
  setDataObject,
  getObject
};

class ActsSelect extends Component {
  state = {
    open: false,
  };

  constructor(props) {
    super(props);
    const {getFolders, volume, getObject, acts} = this.props;
  }

  componentWillMount() {

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
    const {volume, groups, acts, volumes} = this.props;
    console.log(volumes);
    return (
      <div>
      <Grid item>
        <p>Search for Activities in the Mindlogger Library.</p>
      </Grid>
      <Grid item>
      <p>Search by keywords under Activity, or filter by Volume, Organization, and/or Category.</p>
      </Grid>
      <Grid item>
      <p>Select one Activity, or one Volume of Activities to explore further.</p>
      </Grid>
      <Grid container spacing={8} justify="space-between">
        <Grid item xs={2}>
          <center>
            <h4>Activity</h4>
            <TextField></TextField>
          </center>
        </Grid>
        <Grid item xs={3}>
          <center>
            <h4>Volume</h4>
              <MultipleSelect menu={{"name": "Volume", "items": volumes.map((vol) => vol._id != volume._id ? (vol.meta && vol.meta.shortName && vol.meta.shortName != vol.name ? Object.assign(vol, {'name': vol.meta.shortName + " (" + vol.name + ")"}) : vol) : null)}}></MultipleSelect>
          </center>
        </Grid>
        <Grid item xs={3}>
          <center>
            <h4>Organization</h4>
            <Select value="">
              <MenuItem value=""></MenuItem>
            </Select>
          </center>
        </Grid>
        <Grid item xs={3}>
          <center>
            <h4>Category</h4>
            <Select value="">
              <MenuItem value=""></MenuItem>
            </Select>
          </center>
        </Grid>
        <Grid item xs={1}>
          <center>
            <br/>
            <h4>&#128269;</h4>
          </center>
        </Grid>
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
)(ActsSelect);
