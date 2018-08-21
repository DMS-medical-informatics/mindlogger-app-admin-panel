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
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import { Modal } from 'react-bootstrap';

import ActGroup from './ActGroup';
import { getFolders, addFolder } from "../../../actions/api";
import { setDataObject } from "../../../actions/core";
import { InputRow } from '../../forms/Material';

const mapStateToProps = (state, ownProps) => ({
  volume: state.entities.volume,
  groups: state.entities.folder.groups || [],
  acts: state.entities.folder.acts,
});

const mapDispatchToProps = {
  getFolders,
  addFolder,
  setDataObject,
};

class Acts extends Component {
  state = {
    open: false,
  };
  componentWillMount() {
    const {getFolders, volume} = this.props;
    this.props.getFolders(volume._id, 'groups', 'folder').then(res => {
      if (res.length == 0) {
        return this.createDefaultGroups();
      }
    });
  }

  handleListItemClick(obj) {
    const {setDataObject, history} = this.props;
    setDataObject(obj);
    history.push(`/acts/${obj._id}/edit`);
  }

  handleClose = () => {
    this.setState({open: false});
  }

  renderSelectDialog(array) {
    console.log(this.state.open);
    return (<Modal show={this.state.open} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select one</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <List>
          {array && array.map(obj => (
            <ListItem button onClick={() => this.handleListItemClick(obj)} key={obj._id}>
              <ListItemText primary={obj.name} />
            </ListItem>
          ))}
          <ListItem button onClick={() => this.handleListItemClick('addAccount')}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add new version" />
          </ListItem>
        </List>
      </Modal.Body>
    </Modal>)
  }

  onEdit = (folder) => {
    const {getFolders} = this.props;
    this.setState({open: true});
    getFolders(folder._id, 'acts', 'folder').then(res => {
      
    });
  }

  createDefaultGroups() {
    const {addFolder, getFolders, volume} = this.props;
    return addFolder('Activities',{},volume._id, 'folder').then(res => {
      return this.props.getFolders(volume._id, 'groups', 'folder');
    });
  }
  render() {
    const {volume, groups, acts} = this.props;
    return (
      <div>
      <p>Edit the {volume.meta && volume.meta.shortName} Volume’s Information, Consent, and Activities, and each Activity’s Instructions. Tap [+] to add an entry, and tap any entry to edit or delete.</p>
      <InputRow label="Search Activities"><TextField type="search" className="search-text"/> </InputRow>
      <Grid container spacing={8} justify="space-between">
        { groups.map((group,idx) => <ActGroup group={group} key={group._id} onEdit={this.onEdit}/>) }
      </Grid>
      { this.renderSelectDialog(acts) }
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