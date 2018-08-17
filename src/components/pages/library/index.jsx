import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

import { InputField } from "../../forms/FormItems";
import InputFileField from "../../forms/InputFileField";
import { isRequired } from "../../forms/validation";

import { getObject, getCollection, getFolders, addFolder } from "../../../actions/api";

import plus from './plus.svg';

const AddVolumeForm = reduxForm({
  form: "add-volume-form"
})(({ handleSubmit, pristine, submitting }) => (
  <div>
  <p>Create a new Volume of Activities. Mindlogger will create a cross-platform app with these Activities.</p>
  <Form onSubmit={handleSubmit}>
    <Field
      name="shortName"
      type="text"
      component={InputField}
      label="Short Name"
      placeholder=""
      validate={isRequired}
    />
    <Field
      name="name"
      type="text"
      component={InputField}
      label="Full Name"
      placeholder=""
      validate={isRequired}
    />
    <Field
      name="description"
      type="text"
      componentClass="textarea"
      component={InputField}
      label="Description"
      placeholder=""
      validate={isRequired}
    />
    <Field
      name="logo"
      type="file"
      component={InputFileField}
      label="Logo"
      placeholder=""
    />
    <center>
    <Button
      bsStyle="primary"
      type="submit"
    >
      Save
    </Button>
    </center>
  </Form>
  </div>
));

class Home extends Component {
  componentWillMount() {
    const {getCollection, getFolders} = this.props;
    getCollection('Volumes').then(res => {
      getFolders(res[0]._id, 'volumes');
    });
    this.setState({});
  }

  selectPage = page => {
    this.setState({ page });
    this.props.getOrganizations((page - 1) * 10, 10);
  };

  onAddVolume = ({name, ...data}) => {
    const {addFolder, collection, getFolders} = this.props;
    return addFolder(name, data, collection._id, 'collection').then(res => {
      getFolders(collection._id, 'volumes');
      this.close();
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
          <AddVolumeForm onSubmit={this.onAddVolume} />
        </Modal.Body>
      </Modal>
    );
  };

  selectVolume(index) {
    this.props.history.push(`/volumes/${index}`);
  }

  render() {
    const {volumes} = this.props;
    return (
      <div>
        <div className="volumes">
          {
            volumes && volumes.map((volume, i) => 
              (<div className="volume" key={i} onClick={() => this.selectVolume(i)}>
                <span>{volume.name}</span>
              </div>)
            )
          }
          <div className="plus-button" onClick={() => this.setState({form: true})}>
            <img src={plus} alt="plus"/>
          </div>
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
  //getVolumes, addVolume, submit
};

const mapStateToProps = state => ({
  organizations: state.entities.organizations,
  collection: state.entities.collection && state.entities.collection.volumes,
  volumes: state.entities.folder && state.entities.folder.volumes,
  total_count: (state.entities.paging && state.entities.paging.total) || 0,
  user: state.entities.auth || {}
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Home);
