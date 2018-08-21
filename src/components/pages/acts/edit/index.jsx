import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Prompt } from 'react-router-dom';
import {
  Button,
  Modal,
  Tab, Tabs
} from "react-bootstrap";

import Screens from './Screens';
import ActSetting from "./ActSetting";
import { getItems, getObject } from "../../../../actions/api";
import { setActChanged } from "../../../../actions/core";

class EditAct extends Component {
  componentWillMount() {
    const {actId, getObject} = this.props;
    getObject('folder', actId).then(act => {
      this.decodeData(act);
    });
    this.setState({data: {}})
  }

  componentDidMount() {
    const {router, route, setActChanged} = this.props;
    setActChanged(true);
  }

  componentWillUnmount() {
    this.props.setActChanged(false);
  }

  decodeData(act) {
    const {name, meta:{abbreviation, screens}} = act;
    this.setState({setting: {name, abbreviation}, screens });
  }

  close = e => {
    this.setState({ form: "" });
  };

  onSubmit = () => {
    const {setActChanged} = this.props;
    setActChanged(false);
  }

  render() {
    const {setting, screens} = this.state;
    return (
      <section className="edit-act">
        <Prompt when={this.props.changed} message={location => 'Are you sure you want to leave this page?'} />
        <Tabs id="edit-act-tabs"  defaultActiveKey={2}>
          <Tab eventKey={1} title="Settings">
            <ActSetting setting={setting} onSetting/>
          </Tab>
          <Tab eventKey={2} title="Screens">
            <Screens screens={screens} ref={ref => this.screensRef = ref}/>
          </Tab>
          <Button bsStyle="primary" className="save-btn" onClick={this.onSubmit}>Submit</Button>
        </Tabs>
      </section>
    );
  }
}
const mapDispatchToProps = {
  getItems, getObject, setActChanged
};

const mapStateToProps = (state, ownProps) => ({
  act: state.entities.data && state.entities.data[ownProps.match.params.id],
  actId: ownProps.match.params.id,
  changed: state.entities.actChanged,
  actIndex: ownProps.match.params.id,
  user: state.entities.auth || {},
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(EditAct);
