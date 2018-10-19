import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { withRouter } from "react-router";


import { Modal } from 'react-bootstrap';

import ActGroup from './ActGroup';
import { getFolders, addFolder, copyObject, updateFolder } from "../../../actions/api";
import { setDataObject } from "../../../actions/core";
import AddActForm from './AddObjectForm';
import ActSelect from './select/ActSelect';
import InfoGroup from './InfoGroup';

const mapStateToProps = (state, ownProps) => ({
  volume: state.entities.volume,
  groups: state.entities.folder.groups || [],
  acts: state.entities.folder.acts,
});

const mapDispatchToProps = {
  getFolders,
  addFolder,
  setDataObject,
  copyObject,
  updateFolder,
};

const defaultSetting = {
  resumeMode: 'free',
  notification: {
    resetDate: true,
    resetTime: true,
  },
  permission: {
    font: true,
    delete: true,
    skip: true,
    prev: true,
  }
};

class Acts extends Component {
  state = {
    open: false,
  };
  componentWillMount() {
    return this.createDefaultGroups();
  }

  updateData(groups) {
    let actGroup;
    let infoGroup;
    groups.forEach(folder => {
      if (folder.meta && folder.meta.info) {
        infoGroup = folder;
      } else {
        actGroup = folder;
      }
    });
    this.setState({actGroup, infoGroup});
  }

  handleListItemClick = (obj, isInfo=false) => {
    const {setDataObject, history} = this.props;
    setDataObject(obj);
    if (isInfo)
      history.push(`/act_infos/${obj._id}/edit`);
    else
      history.push(`/acts/${obj._id}/edit`);
  }

  handleAddClick(obj) {
    this.setState({open: 'add_variant'})
  }

  handleClose = () => {
    this.setState({open: false});
  }

  // Deprecated Select variant dialog
  // renderSelectDialog(array) {
  //   return (<Modal show={this.state.open === 'select'} onHide={this.handleClose}>
  //     <Modal.Header closeButton>
  //       <Modal.Title>Select one</Modal.Title>
  //     </Modal.Header>
  //     <Modal.Body>
  //       <List>
  //         {array && array.map(obj => (
  //           <ListItem button onClick={() => this.handleListItemClick(obj)} key={obj._id}>
  //             <ListItemText primary={obj.name} />
  //           </ListItem>
  //         ))}
  //         <ListItem button onClick={() => this.handleAddClick('addAccount')}>
  //           <ListItemAvatar>
  //             <Avatar>
  //               <AddIcon />
  //             </Avatar>
  //           </ListItemAvatar>
  //           <ListItemText primary="Add new version" />
  //         </ListItem>
  //       </List>
  //     </Modal.Body>
  //   </Modal>)
  // }

  onEdit = (folder, isInfo = false) => {
    const {getFolders} = this.props;
    this.groupId = folder._id;
    getFolders(folder._id, 'acts', 'folder').then(res => {
      let variant;
      res.forEach(m => {
        if (!(m.meta && m.meta.info))
          variant = m;
      });
      this.handleListItemClick(variant, isInfo);

    });
  }

  onAddAct = (group) => {
    this.groupId = group._id;
    this.setState({open: 'add'});
  }

  openLibrary = () => {
    this.setState({library: true});
  }

  renderAddActDialog() {
    return (<Modal show={this.state.open === 'add'} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddActForm onSubmit={this.handleSubmitAct} onLibrary={() => this.openLibrary()}/>
      </Modal.Body>
    </Modal>)
  }


  handleSubmitAct = ({name}) => {
    const {addFolder} = this.props;
    const {folder, subfolder} = this.state;
    const meta = {};
    if (folder === 'volume') {
      meta[subfolder] = true;
    }
    
    return addFolder(name, meta, this.groupId, 'folder').then(res => {
      return addFolder(name, defaultSetting, res._id, 'folder', false).then(obj => {
        this.handleListItemClick(obj);
      })
    });
  }

  handleImport = (act) => {
    const {folder, subfolder} = this.state;
    const {volume, copyObject, updateFolder} = this.props;
    this.setState({open: false, library: false});
    copyObject(act._id, 'folder', this.groupId, 'folder').then(res => {
      if(subfolder) {
        let meta = {info: false, consent: false};
        meta[subfolder] = true;
        return updateFolder(res._id, res.name , meta);
      }
      
    }).then(res => {
      this.setState({folder: undefined, subfolder: undefined});
    });
  }

  createDefaultGroups() {
    const {addFolder, getFolders, volume} = this.props;
    return addFolder('Activities',{},volume._id, 'folder').then(actGroup => {
      this.setState({actGroup});
      return addFolder('Info', {info: true}, volume._id, 'folder');
    }).then(infoGroup => {
      this.setState({infoGroup});
      return getFolders(volume._id, 'groups', 'folder');
    })
  }

  onAddInfoScreen = (subfolder) => {
    this.groupId = this.state.infoGroup._id;
    this.setState({folder: 'volume', subfolder, open: 'add'});
  }

  onAddActInfoScreen = (act, subfolder) => {
    this.groupId = act._id;
    this.setState({folder: 'act', subfolder, open: 'add_variant'});
  }

  renderAddActVariantDialog() {
    return (<Modal show={this.state.open === 'add_variant'} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddActForm onSubmit={this.handleSubmitActVariant}/>
      </Modal.Body>
    </Modal>)
  }

  handleSubmitActVariant = ({name}) => {
    const {addFolder} = this.props;
    const {subfolder} = this.state;
    const meta = {};
    if(subfolder) {
      meta[subfolder] = true;
    }
    return addFolder(name, meta, this.groupId, 'folder').then(res => {
      this.handleClose();
      this.handleListItemClick(res);
    });
  }

  renderVolumeActs() {
    const {volume} = this.props;
    const {actGroup, infoGroup} = this.state;
    return (
      <div>
        <h3>Edit Activities</h3>
        <div className="p-3">
        {infoGroup && <InfoGroup key={infoGroup._id} name={volume.meta.shortName} group={infoGroup} onAdd={this.onAddInfoScreen} onEdit={this.onEdit} />}
        </div>
      {actGroup && 
      <ActGroup group={actGroup}
        onEdit={this.onEdit}
        onAdd={this.onAddAct}
        onAddInfo={this.onAddActInfoScreen}
        onEditInfo={this.handleListItemClick}
        /> }
      { this.renderAddActDialog() }
      { this.renderAddActVariantDialog() }
      </div>
    );
  }
  render() {
    const {folder, subfolder, library} = this.state;
    if(library) {
      return <ActSelect onSelect={this.handleImport} />
    } else {
      return this.renderVolumeActs();
    }
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Acts);