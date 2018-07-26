import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  Button,
  Modal,
  Tab, Tabs
} from "react-bootstrap";

import Screens from './screens';
//import { getVolumes, addVolume } from "../../../actions/api"

class EditAct extends Component {
  componentWillMount() {

  }

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
          
        </Modal.Body>
      </Modal>
    );
  };

  render() {

    // let data = [
    //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
    //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
    // ]
    return (
      <section className="edit-act">
      <Tabs id="edit-act-tabs" defaultActiveKey={2}>
        <Tab eventKey={1} title="Settings">
          Settings
        </Tab>
        <Tab eventKey={2} title="Screens">
          <Screens/>
        </Tab>
        <Button>Submit</Button>
      </Tabs>
      </section>
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
)(EditAct);
