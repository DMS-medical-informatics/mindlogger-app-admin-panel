import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Prompt } from 'react-router-dom';
import {
  Button,
  Tab, Tabs
} from "react-bootstrap";

import { getItems, getObject, addItem, updateFolder } from "../../../../actions/api";
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
      if (screensData[index] === undefined) {
        const id = screens[index]['@id'].split("/")[1];
        console.log("loading..", id);
        getObject('item', id).then(res => {
          let screensData = [...this.state.screensData];
          screensData[index] = {name: res.name, ...res.meta};
          this.setState({index, screensData}, () => {
            this.formRef.reset();
          });
        })
      } else {
        this.setState({index}, () => {
          this.formRef.reset();
        });
      }
    }
  }

  addScreen = () => {
    let {screens} = this.state;
    let screensData = [...this.state.screensData];
    screensData.push({name:''});
    if (screens && screens.length > 0) {
      let formErrors = this.formRef.submit();
      if (formErrors) {
        return;
      }
    } else {
      screens = [];
    }
    screens.push({})
    this.setState({screens, screensData}, () => {
      this.loadScreen(screens.length-1);
    });

    // const {volume, addItem} = this.props;
    // addItem('item', 'screen',{}, volume._id, 'collection').then(res => {

    // });
  }

  selectScreen = (index) => {
    if (this.state.index === undefined ) {
      this.loadScreen(index);
    } else {
      let formErrors = this.formRef.submit();
      if (formErrors === undefined) {
        this.loadScreen(index);
      } else {
        window.alert("Please fix valdiation errors");
      }
    }

  }

  onSaveScreen = (body) => {
    const {index,screensData} = this.state;
    screensData[index] = {...body};
    console.log(body);
    this.setState({screensData});
  }
  componentWillMount() {
    const {actId, getObject} = this.props;
    getObject('folder', actId).then(act => {
      this.decodeData(act);
    });
  }

  componentDidMount() {
    const {setActChanged} = this.props;
    setActChanged(true);
  }

  componentWillUnmount() {
    this.props.setActChanged(false);
  }

  decodeData(act) {
    const {name} = act;
    const {screens, ...setting} = act.meta || {};
    this.setState({setting: {name, ...setting}, screens });
    this.loadScreen(0, screens);
  }

  close = e => {
    this.setState({ form: "" });
  };

  onSetting = (setting) => {
    this.setState({setting});
  }

  onSubmit = () => {
    const {setActChanged, addItem, act, updateFolder} = this.props;
    let prArray = [];
    let formErrors = this.formRef.submit();
    if (formErrors) {
      window.alert("Please fix valdiation errors in screens");
      return;
    }
    formErrors = this.settingRef.submit();
    if (formErrors) {
      window.alert("Please fix valdiation errors in settings");
      return;
    }
    const {screens, screensData} = this.state;
    for (let i = 0; i < screens.length; i++) {
      const idData = screens[i]['@id'];
      const {name, ...screen} = screensData[i];
      const index = i;
      if (idData === undefined) {
        prArray.push(addItem(name, screen, act._id).then(res => {
          screens[index]= {'@id': `item/${res._id}`}
        }));
      }
    }
    if(prArray.length > 0) {
      return Promise.all(prArray).then(() => {
        const {name, ...setting} = this.state.setting;
        this.setState({screens});
        return updateFolder(name, {screens, ...setting}, act._id);
      }).then(() => {
        setActChanged(false);
      });
    } else {

    }

  }

  render() {
    const {screensData, index, setting, screens} = this.state;
    let screen = screensData[index];
    console.log(screen);
    return (
      <section className="edit-act">
        <Prompt when={this.props.changed} message={location => 'Are you sure you want to leave this page?'} />
        <Tabs id="edit-act-tabs"  defaultActiveKey={2}>
          <Tab eventKey={1} title="Settings">
            <ActSetting setting={setting} onSetting={this.onSetting} onFormRef={ref => this.settingRef = ref }/>
          </Tab>
          <Tab eventKey={2} title="Screens">
            <div className="screens">
              <Bookmarks screens={screens} index={index} onSelect={this.selectScreen} onAdd={this.addScreen}/>
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
  getItems,
  getObject,
  setActChanged,
  addItem,
  updateFolder,
};

const mapStateToProps = (state, ownProps) => ({
  act: state.entities.data && state.entities.data[ownProps.match.params.id],
  actId: ownProps.match.params.id,
  changed: state.entities.actChanged,
  actIndex: ownProps.match.params.id,
  user: state.entities.auth || {},
  volume: state.entities.volume,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(EditAct);
