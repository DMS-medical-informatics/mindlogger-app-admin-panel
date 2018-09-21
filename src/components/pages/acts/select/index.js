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
import Button from '@material-ui/core/Button';

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
    let { filter } = this.state;
    let theseActivities = [];
    getOrganizations().then(function(o){
      let theseVolumes = volumes.map((thisVolume, volNum) => {
        getObject("folder/" + thisVolume._id + "/access").then(function(volumeAccess) {
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
                        let actCounter = 0;
                        thisVolumeActivities.map((thisAct, actfol)=> {
                          let thisActLatest = {"updated": null};
                          getFolders(thisAct._id, thisAct.name, "folder").then(function(thisActivityVersions){
                            for (var actV=0; actV<thisActivityVersions.length; actV++) {
                              thisActLatest = (thisActivityVersions[actV].updated > thisActLatest.updated || thisActLatest.updated == null ? thisActivityVersions[actV] : thisActLatest);
                            }
                            actCounter++;
                            var inArray = theseActivities.map((x)=> {return x._id; }).indexOf(thisActLatest._id);
                            thisActLatest.parentName = thisAct.name;
                            thisActLatest.groups = thisVolume.groups;
                            thisActLatest.volume = thisVolume;
                            thisActLatest.displayName = thisActLatest.meta && thisActLatest.meta["schema:name"] ? thisActLatest.meta["schema:name"]["@value"] : thisActLatest.parentName;
                            (inArray === -1) ? theseActivities.push(thisActLatest) : theseActivities[inArray] = thisActLatest;
                            theseActivities.sort((a, b) => a.displayName.localeCompare(b.displayName));
                            for (var ftype in filter) {
                              theseActivities = theseActivities.filter((act)=> {
                                return ((filter[ftype].indexOf(act[ftype]) === -1) && (filter[ftype].map((x) => {return x._id}).indexOf(act[ftype]._id) === -1));
                              });
                            }
                            tops.setState({'organizations': o, 'activities': theseActivities, 'results': tops.state.results ? tops.state.results : theseActivities});
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

  updateResults = (evt) => {
    const { volume } = this.props;
    const { activities, results } = this.state;
    let filter = evt.target.value;
    let filteredResults = filter.length ? results.filter((activity) => {
      return activity ? activity.displayName.toLowerCase().indexOf(filter.toLowerCase()) !== -1: false;
    }) : activities;
    this.setState({'results': filteredResults});
  }

  render() {
    const {volume, groups, acts, volumes, multiselect} = this.props;
    const {organizations, activities, results} = this.state;
    if (!activities) {
      return(
        <div>
        <Grid item>
          <p>Search for Activities in the Mindlogger Library.</p>
        </Grid>
        <Grid item>
        <p>(1) Type keywords in the search box below.</p>
        </Grid>
        <Grid item>
        <p>(2) Select one Activity, or a Volume of Activities to explore further.</p>
        </Grid>
        <Grid container spacing={8} justify="space-between">
          <Grid item xs={3}>
          </Grid>
        </Grid>
        <Grid container spacing={8} justify="space-between">
          <Grid item xs={3}>
            <h4><strong>{results ? results.length + " Activities:" : "Loading…"}</strong></h4>
          </Grid>
          <Grid item xs={3}>
            <h4><strong></strong></h4>
          </Grid>
          <Grid item xs={3}>
            <h4><strong></strong></h4>
          </Grid>
          <Grid item xs={2}>
            <h4><strong></strong></h4>
          </Grid>
          <Grid item xs={1}>
            <h4><strong></strong></h4>
          </Grid>
        </Grid>
        </div>
      );
    }
    return (
      <div>
      <Grid item>
        <p>Search for Activities in the Mindlogger Library.</p>
      </Grid>
      <Grid item>
      <p>(1) Type keywords in the search box below.</p>
      </Grid>
      <Grid item>
      <p>(2) Select one Activity, or a Volume of Activities to explore further.</p>
      </Grid>
      <Grid container spacing={8} justify="space-between">
        <Grid item xs={3}>
          <TextField className="searchText" value={this.state.inputValue} onChange={evt => this.updateResults(evt)}></TextField>
        </Grid>
      </Grid>
      <Grid container spacing={8} justify="space-between">
        <Grid item xs={3}>
          <h4><strong>{results ? results.length + " Activities:" : ""}</strong></h4>
        </Grid>
        <Grid item xs={3}>
          <h4><strong>Volume</strong></h4>
        </Grid>
        <Grid item xs={3}>
          <h4><strong>Organization</strong></h4>
        </Grid>
        <Grid item xs={2}>
          <h4><strong>Category</strong></h4>
        </Grid>
        <Grid item xs={1}>
          <h4><strong>Preview</strong></h4>
        </Grid>
      </Grid>
      { results.map((act)=>
        <Grid container spacing={8} justify="space-between" key={act._id + "∕activityrow"}>
          <Grid item xs={3} key={act._id + "∕" + act.displayName}>
            <Button size='small' style={{'textAlign':'left', 'textTransform': 'capitalize', 'justifyContent': 'left'}} onClick={null}>{ act.displayName }</Button>
          </Grid>
          <Grid item xs={3} key={act._id + "∕" + act.volume.name}>
            { act.volume.name }
          </Grid>
          <Grid item xs={3} key={act._id + "∕groups"}>
            { act.groups.map((group, i)=> {group.name + (i+1 < act.groups.length ? ", " : "")}) }
          </Grid>
          <Grid item xs={2} key={act._id + "∕categories"} style={act.category ? null : {fontStyle: 'italic'} }>
            { act.category ? act.category : "unknown" }
          </Grid>
          <Grid item xs={1} key={act._id + "∕preview"}>
            <Button>&#128065;</Button>
          </Grid>
        </Grid>
      ) }
      {multiselect ? <div style={{"position":"fixed","bottom":"5px"}}>
      <Button variant="contained" color="primary">
        Submit
      </Button>
      </div> : null}
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
