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

import MultipleSelect from './MultipleSelect';

import { Modal } from 'react-bootstrap';

import ActGroup from '../ActGroup';
import { getFolders, addFolder, getObject, getOrganizations } from "../../../../actions/api";
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
  getObject,
  getOrganizations
};

class ActsSelect extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    let tops = this;
    const {getFolders, volume, getObject, acts, getOrganizations, volumes} = this.props;
    let theseActivities = [];
    let numActs = 0;
    getOrganizations().then(function(o){
      let theseVolumes = volumes.map((thisVolume) => {
        getObject("folder", thisVolume._id + "/access").then(function(volumeAccess) {
          for (var g=0; g<volumeAccess.groups.length; g++){
            for (var og=0; og<o.length; og++) {
              if (volumeAccess.groups[g].id == o[og]._id) {
                let volGroup = o[og];
                thisVolume.groups ? thisVolume.groups.push(volGroup) : thisVolume.groups=[volGroup];
                volGroup.volumes ? volGroup.volumes.push(thisVolume) : volGroup.volumes=[thisVolume];
                getFolders(thisVolume._id, thisVolume.name, "folder").then(function(volumeTop) {
                  for (var volfol=0; volfol<volumeTop.length; volfol++){
                    if (volumeTop[0].name=="Activities"){
                      getFolders(volumeTop[0]._id, "Activities", "folder").then(function(thisVolumeActivities){
                        let actfol = thisVolumeActivities.map((thisAct)=> {
                          let thisActLatest = {"updated": null};
                          getFolders(thisAct._id, thisAct.name, "folder").then(function(thisActivityVersions){
                            for (var actV=0; actV<thisActivityVersions.length; actV++) {
                              thisActLatest = (thisActivityVersions[actV].updated > thisActLatest.updated || thisActLatest.updated == null ? thisActivityVersions[actV] : thisActLatest);
                            }
                            var inArray = theseActivities.map((x)=> {return x._id; }).indexOf(thisActLatest._id);
                            thisActLatest.parentName = thisAct.name;
                            thisActLatest.groups = thisVolume.groups;
                            thisActLatest.volume = thisVolume;
                            thisActLatest.displayName = thisActLatest.meta && thisActLatest.meta["schema:name"] ? thisActLatest.meta["schema:name"]["@value"] : thisActLatest.parentName;
                            if (thisActLatest.updated !== null) {
                              inArray == -1 ? theseActivities.push(thisActLatest) : theseActivities[inArray] = thisActLatest;
                            }
                            theseActivities.sort((a, b) => a.displayName.localeCompare(b.displayName));
                            numActs === theseActivities.length ? (tops.setState({'organizations': o, 'activities': theseActivities})) : numActs = theseActivities.length;
                            console.log(theseActivities);
                          });
                        });
                      });
                    }
                  }
                });
              }
            }
          }
        });
      });
    });
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

  updateResults(results) {
    console.log(results);
  }

  render() {
    const {volume, groups, acts, volumes} = this.props;
    const {organizations, activities} = this.state;
    if (!activities) {
      return(false);
    }
    let results = activities.filter((act)=> act.volume._id !== volume._id);
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
            <TextField className="searchText"></TextField>
          </center>
        </Grid>
        <Grid item xs={3}>
          <center>
            <h4>Volume</h4>
              <MultipleSelect handler={this.updateResults} menu={{"name": "Volume", "items": volumes.map((vol) => vol._id != volume._id ? vol : null)}}></MultipleSelect>
          </center>
        </Grid>
        <Grid item xs={3}>
          <center>
            <h4>Organization</h4>
              <MultipleSelect handler={this.updateResults} menu={{"name": "Organization", "items": organizations}}></MultipleSelect>
          </center>
        </Grid>
        <Grid item xs={3}>
          <center>
            <h4>Category</h4>
            <MultipleSelect handler={this.updateResults} menu={{"name": "Category", "items": []}}></MultipleSelect>
          </center>
        </Grid>
        <Grid item xs={1}>
          <center>
            <br/>
            <h4>&#128269;</h4>
          </center>
        </Grid>
      </Grid>
      <Grid container spacing={8} justify="space-between">
        <Grid item xs={2}>
          <center>
            <h4><strong>{results ? results.length + " Activities:" : ""}</strong></h4>
          </center>
        </Grid>
      </Grid>
      { results.map((act)=>
        <Grid container spacing={8} justify="space-between">
          <Grid item xs={2}>
            <center>
              { act.displayName }
            </center>
          </Grid>
          <Grid item xs={3}>
            <center>
              { act.volume.name }
            </center>
          </Grid>
          <Grid item xs={3}>
            <center>
              { act.groups.map((group, i)=> <span key={act._id + "organizations"}> {group.name + (i+1 < act.groups.length ? ", " : "")} </span>) }
            </center>
          </Grid>
          <Grid item xs={3}>
            <center>
            </center>
          </Grid>
          <Grid item xs={1}>
            <center>
              <br/>
              <h4>&#129488;</h4>
            </center>
          </Grid>
        </Grid>
      ) }
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
