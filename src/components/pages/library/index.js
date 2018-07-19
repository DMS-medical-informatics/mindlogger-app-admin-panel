import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm, submit } from "redux-form";
import { withRouter } from "react-router";
import { BarChart } from "recharts";
import {
  Row,
  Col,
  Panel,
  Table,
  Pagination,
  Button,
  Modal,
  FormGroup,
  FormControl
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { InputField } from "../../forms/FormItems";
import { isRequired, isValidEmail } from "../../forms/validation";

//import { getVolumes, addVolume } from "../../../actions/api"

import plus from './plus.svg';

const AddVolumeForm = reduxForm({
  form: "add-organization-form"
})(({ handleSubmit, pristine, submitting }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="name"
      type="text"
      component={InputField}
      label="Name"
      placeholder=""
      validate={isRequired}
    />
  </form>
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

  renderOrganizationModal = () => {
    return (
      <Modal show={this.state.form == true} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Add Organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddVolumeForm onSubmit={this.onAddOrganization} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle="primary"
            onClick={() => this.props.submit("add-organization-form")}
          >
            Add
          </Button>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  render() {
    const { organizations, total_count, user } = this.props;
    const total_pages = total_count / 10 + 1;
    const { page } = this.state;

    // let data = [
    //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
    //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
    // ]
    return (
      <div>
        <h2 className="text-center">Organizations</h2>
        <div className="volumes">
          <div className="volume">
            <span>TEST</span>
          </div>
          <div className="volume">
            <span>HBN</span>
          </div>
          <div className="plus-button">
            <img src={plus} />
          </div>
        </div>
        <Row>
          <Col xs={10} xsOffset={1}>
            {this.renderOrganizationModal()}
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
