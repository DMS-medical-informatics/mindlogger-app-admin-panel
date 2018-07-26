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
import { isRequired } from "../../forms/validation";

//import { getVolumes, addVolume } from "../../../actions/api"

import plus from './plus.svg';

const AddVolumeForm = reduxForm({
  form: "add-organization-form"
})(({ handleSubmit, pristine, submitting }) => (
  <Form onSubmit={handleSubmit} horizontal>
    <Field
      name="short_name"
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
      component={InputField}
      label="Logo"
      placeholder=""
      validate={isRequired}
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
));

class Home extends Component {
  componentWillMount() {
    //this.props.getOrganizations(0, 10)
    this.setState({ page: 1 });
  }

  selectPage = page => {
    this.setState({ page });
    this.props.getOrganizations((page - 1) * 10, 10);
  };

  onAddOrganization = body => {
    return this.props.addOrganization(body).then(res => {
      this.close();
      return this.props.getOrganizations(0, 10);
    });
  };

  close = e => {
    this.setState({ form: "" });
  };

  renderAddVolumeModal = () => {
    return (
      <Modal show={this.state.form} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Add Volume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Create a new Volume of Activities. Mindlogger will create a cross-platform app with these Activities.</p>
          <AddVolumeForm onSubmit={this.onAddOrganization} />
        </Modal.Body>
      </Modal>
    );
  };

  render() {
    return (
      <div>
        <div className="volumes">
          <div className="volume">
            <span>TEST</span>
          </div>
          <div className="volume">
            <span>HBN</span>
          </div>
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
  //getVolumes, addVolume, submit
};

const mapStateToProps = state => ({
  organizations: state.entities.organizations,
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
