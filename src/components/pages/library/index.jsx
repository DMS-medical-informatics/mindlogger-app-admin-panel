import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  Row,
  Col,
  Modal,
} from "react-bootstrap";

import { getObject, getCollection, getFolders, addFolder, updateFolder, uploadFile } from "../../../actions/api";
import { setVolume } from "../../../actions/core";
import VolumeForm from "./VolumeForm";
import plus from './plus.svg';
import Image from "../../controls/Image";


class Home extends Component {
  componentWillMount() {
    const {getCollection, getFolders, setVolume} = this.props;
    getCollection('Volumes').then(res => {
      getFolders(res[0]._id, 'volumes');
    });
    this.setState({});
    setVolume(undefined);
  }

  selectPage = page => {
    this.setState({ page });
    this.props.getOrganizations((page - 1) * 10, 10);
  };

  onAddVolume = ({name, logo, ...data}) => {
    const {addFolder, updateFolder, collection, getFolders, uploadFile} = this.props;
    return addFolder(name, data, collection._id, 'collection').then(folder => {
      if(logo && Array.isArray(logo) && logo.length > 0) {
        let fileObject = logo[0];
        return uploadFile(fileObject.name, fileObject, 'folder', folder._id).then(res => {
          return updateFolder(folder._id, name, {
            ...data,
            logoImage: {
              name: res.name,
              '@id': `file/${res.name}`
            }
          });
        });
      }
      return true;
    }).then(res => {
      this.close();
      return getFolders(collection._id, 'volumes');
    });
  };

  close = e => {
    this.setState({ form: false });
  };

  renderAddVolumeModal = () => {
    return (
      <Modal show={this.state.form} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Add Volume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VolumeForm onSubmit={this.onAddVolume} />
        </Modal.Body>
      </Modal>
    );
  };

  selectVolume(index) {
    this.props.history.push(`/volumes/${index}`);
  }

  renderVolume(i,meta) {
    let image = meta.logoImage
    if (image) {
      return <div key={i} className="volume" onClick={() => this.selectVolume(i)}>
        <div><Image file={image}/></div>
        <div className="volume__text">{meta.shortName}</div>
        </div>
    } else {
      return <div key={i} className="volume" onClick={() => this.selectVolume(i)}>
        <div className="volume__text">{meta.shortName}</div>
      </div>
    }
  }

  render() {
    const {volumes, user} = this.props;
    console.log(user);
    return (
      <div>
        <div className="volumes">
          {
            volumes && volumes.map((volume, i) => 
                this.renderVolume(i, volume.meta)
            )
          }
          {
            user.meta && user.meta.role == 'admin' && <div className="plus-button" onClick={() => this.setState({form: true})}>
              <img src={plus} alt="plus"/>
            </div>
          }
          
        </div>
        <Row>
          <Col xs={10} xsOffset={1}>
            {this.renderAddVolumeModal()}
          </Col>
        </Row>
      </div>
    );
  }
}
const mapDispatchToProps = {
  getObject,
  getCollection,
  getFolders,
  addFolder,
  uploadFile,
  updateFolder,
  setVolume,
};

const mapStateToProps = state => ({
  organizations: state.entities.organizations,
  collection: state.entities.collection && state.entities.collection.volumes,
  volumes: state.entities.folder && state.entities.folder.volumes,
  total_count: (state.entities.paging && state.entities.paging.total) || 0,
  user: state.entities.self || {}
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Home);
