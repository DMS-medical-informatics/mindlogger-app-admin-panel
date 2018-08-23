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

import { getItems, getObject } from "../../../../actions/api";
import { setActChanged } from "../../../../actions/core";
import ActSetting from "./ActSetting";
import Bookmarks from './Bookmarks';
import Screen from './Screen';

class EditAct extends Component {

  state = {
    settings: {},
    screens: [],
    screensData: [],
  }

  loadScreen(index, screens) {
    let {screensData} = this.state;
    if (!screens) {
      screens = this.state.screens;
    }
    const {getObject} = this.props;
    if (screens && screens[index]) {
      const id = screens[index]['@id'].split("/")[1];
      
      if (screensData[index] === undefined) {
        console.log("loading..", id);
        getObject('item', id).then(res => {
          let screensData = [...this.state.screensData];
          screensData[index] = {name: res.name, ...res.meta};
          this.setState({index, screensData});
        })
      } else {
        this.setState({index});
      }
    }
  }

  selectScreen = (index) => {
    if (this.formRef) {
      let errors = this.formRef.submit();
      if (errors === undefined) {
        this.loadScreen(index);
      } else {
        window.alert("Please fix valdiation errors");
      }
    } else {
      this.loadScreen(index);
    }
  }

  onSaveScreen = (body) => {
    const {index,screensData, screens} = this.state;
    screensData[index] = body;
    this.setState({screensData});
  }
  componentWillMount() {
    const {actId, getObject} = this.props;
    getObject('folder', actId).then(act => {
      this.decodeData(act);
    });
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
    this.loadScreen(0, screens);
  }

  close = e => {
    this.setState({ form: "" });
  };

  onSubmit = () => {
    const {setActChanged} = this.props;
    setActChanged(false);
  }

  render() {
    const {screensData, index, setting, screens} = this.state;
    const screen = screensData[index];
    return (
      <section className="edit-act">
        <Prompt when={this.props.changed} message={location => 'Are you sure you want to leave this page?'} />
        <Tabs id="edit-act-tabs"  defaultActiveKey={2}>
          <Tab eventKey={1} title="Settings">
            <ActSetting setting={setting} onSetting/>
          </Tab>
          <Tab eventKey={2} title="Screens">
            <div className="screens">
              <Bookmarks screens={screens} index={index} onSelect={this.selectScreen} />
              <Screen index={index} screen={screen} onFormRef={ref => (this.formRef = ref)} onSaveScreen={this.onSaveScreen}/>
            </div>
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
