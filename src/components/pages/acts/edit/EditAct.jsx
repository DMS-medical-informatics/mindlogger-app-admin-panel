import React, { Component } from "react";
import { connect } from "react-redux";
import { Prompt } from 'react-router-dom';
import {
  Button as Submit,
  Tab, Tabs,
  Modal
} from "react-bootstrap";

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { getItems, getObject, addItem, updateItem, updateFolder, deleteObject } from "../../../../actions/api";
import { setActChanged } from "../../../../actions/core";
import ActSetting from "./ActSetting";
import Bookmark from './Bookmark';
import Screen from './Screen';
import AddObjectForm from '../AddObjectForm';

class EditAct extends Component {

  state = {
    settings: {},
    screens: [],
    screensData: [],
  }

  loadAllScreens() {
    const {actId, getItems} = this.props;
    getItems(actId).then(res => {
      console.log(this.props.screensHash);
    });
  }

  updateScreen(index, screen) {
    let screensData = [...this.state.screensData];
    screensData[index] = { name: screen.name, ...screen.meta, id: screen._id};
    this.setState({index, screensData}, () => {
      this.formRef.reset();
    });
  }

  loadScreen(index, screens) {
    let {screensData} = this.state;
    const {screensHash} = this.props;
    if (!screens) {
      screens = this.state.screens;
    }
    const {getObject} = this.props;
    if (screens && screens[index]) {
      if (screensData[index] === undefined) {
        const key = `item/${screens[index]['name']}`;
        const id = screens[index]['@id'];
        console.log("loading..", key);

        if (screensHash[key]) {
          this.updateScreen(index, screensHash[key]);
        } else {
          getObject(id).then(res => {
            this.updateScreen(index, res);
          })
        }
      } else {
        this.setState({index}, () => {
          this.formRef.reset();
        });
      }
    }
  }

  addScreen = () => {
    let {screens} = this.state;
    if (screens && screens.length > 0) {
      let formErrors = this.formRef.submit();
      if (formErrors) {
        return;
      }
    } else {
      screens = [];
    }
    this.setState({open: 'add'});

  }

  selectScreen = (index) => {
    if (this.state.index === undefined ) {
      this.loadScreen(index);
    } else {
      let formErrors = this.formRef.submit();
      if (formErrors === undefined) {
        this.loadScreen(index);
      } else {
        window.alert("Please fix validation errors");
      }
    }

  }

  onSaveScreen = (body) => {
    const {index,screensData} = this.state;
    screensData[index] = {...body};
    this.setState({screensData});
  }

  onDeleteScreen = () => {
    const {act, updateFolder, deleteObject} = this.props;
    let {screens, screensData, index} = this.state;
    let screen = screensData.splice(index,1)[0];
    screens.splice(index,1);
    console.log(screen);
    deleteObject(screen.id, 'item').then(res => {
      this.setState({screensData})
      if(screensData.length <= index) {
        index = index - 1;
      }
      if (index>=0)
        this.loadScreen(index);
      const {name: actName, ...setting} = this.state.setting;
      return updateFolder(act._id, actName, {screens, ...setting});
    })
  }
  componentWillMount() {
    const {actId, getObject} = this.props;
    getObject(`folder/${actId}`).then(act => {
      console.log(act);
      this.decodeData(act);
    });
    this.loadAllScreens();
    this.selectTab(1);
  }

  componentDidMount() {
    const {setActChanged} = this.props;
    setActChanged(true);
  }

  componentWillUnmount() {

  }

  decodeData(act) {
    const {name} = act;
    let {screens, ...setting} = act.meta || {};
    screens = screens || [];
    this.setState({setting: {name, ...setting}, screens });
    this.loadScreen(0, screens);
  }

  close = e => {
    this.setState({ form: "" });
  };

  onSetting = (setting) => {
    this.setState({setting});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  onSubmit = () => {
    const {setActChanged, updateItem, act, updateFolder, onSubmit} = this.props;
    let prArray = [];
    let formErrors;
    if (this.formRef) {
      formErrors = this.formRef.submit();
    }
    if (formErrors) {
      window.alert("Please fix validation errors in screens");
      return;
    }
    formErrors = this.settingRef.submit();
    if (formErrors) {
      window.alert("Please fix validation errors in settings");
      return;
    }
    const {screens, screensData} = this.state;
    for (let i = 0; i < screens.length; i++) {
      if(screensData[i] === undefined)
        continue;
      const {name, id, ...screen} = screensData[i];
      prArray.push(updateItem(id, name, screen));
    }
    return Promise.all(prArray).then(() => {
      const {name, ...setting} = this.state.setting;
      this.setState({screens});
      return updateFolder(act._id, name, {screens, ...setting});
    }).then(() => {
      setActChanged(false);
      onSubmit();
    });
  }

  handleAddScreen = ({name}) => {
    const {addItem, act, updateFolder} = this.props;
    let {screens, screensData, setting:{name: actName, ...setting}} = this.state;
    let defaultScreen = {
      skippable: setting.permission && setting.permission.skip
    };
    addItem(name, defaultScreen, act._id).then(res => {
      screens.push({
        '@id': `item/${res._id}`,
        name: res.name,
      });
      screensData.push({name, id:res._id});
      return updateFolder(act._id, actName, {screens, ...setting});
    }).then(res => {
      this.setState({screens: [...screens], screensData});
      this.handleClose();
    });

  }

  renderAddScreenDialog() {
    return (<Modal show={this.state.open === 'add'} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add screen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddObjectForm onSubmit={this.handleAddScreen} />
      </Modal.Body>
    </Modal>)
  }

  getScreen(index, key) {
    const {screensData} = this.state;
    const {screensHash} = this.props;
    if (screensData[index]) {
      return screensData[index];
    } else {
      const screen = screensHash[key];
      if (screen)
        return { name: screen.name, ...screen.meta, id: screen._id};
    }
  }

  renderBookmarks() {
    const {index, screens} = this.state;
    return (
      <div className="bookmarks">
        { screens && screens.map((screen,idx) =>
          <Bookmark
            index={idx}
            key={idx}
            selected={idx === index}
            onSelect={this.selectScreen}
            defaultLength={screens.length}
            screen={this.getScreen(idx, `item/${screen['name']}`)}
            />)
        }
        <center className="p-3">
          <Button variant="fab" aria-label="Add" onClick={this.addScreen}>
            <AddIcon />
          </Button>
        </center>
      </div>
    );
  }

  selectTab = (key) => {

  }

  handleDelete = () => {
    const {act, deleteObject, onSubmit} = this.props;
    this.props.setActChanged(false);
    if (act.meta && act.meta.info) {
      return deleteObject(act._id, 'folder').then(res => {
        onSubmit();
      });
    } else {
      return deleteObject(act.parentId, 'folder').then(res => {
        onSubmit();
      });
    }
  }

  render() {
    const {screensData, index, setting} = this.state;
    const {act, info, volume} = this.props;
    let screen = screensData[index];
    if (!setting) {
      return (<section className="edit-act"></section>)
    }
    return (
      <section className="edit-act">
        <Prompt
          when={this.props.changed}
          message={location => 'You will lose any changes you have made if you don\'t submit them.'} />
        <h3>Edit the {act.meta.abbreviation || act.name} Activity in the {volume.meta.shortName || volume.name} Activity Set</h3>
        <p>Configure {(info || act.meta.info) ? "" : "notifications and other "}settings in the Settings tab, and build each screen in the Screens tab. Disabled features are <span class="disabled">greyed out</span>.</p>
        <Tabs id="edit-act-tabs" onSelect={this.selectTab}  defaultActiveKey={1}>
          <Tab eventKey={1} title="Settings">
            <ActSetting setting={setting} onSetting={this.onSetting} onFormRef={ref => this.settingRef = ref } onDelete={this.handleDelete} info={info}/>
          </Tab>
          <Tab eventKey={2} title="Screens">
            <div className="screens">
              {this.renderBookmarks()}
              <Screen index={index} screen={screen} onFormRef={ref => (this.formRef = ref)} onSaveScreen={this.onSaveScreen} onDelete={this.onDeleteScreen}/>
            </div>
          </Tab>
          <Submit bsStyle="primary" className="save-btn" onClick={this.onSubmit}>Submit</Submit>
        </Tabs>
        { this.renderAddScreenDialog() }
      </section>
    );
  }
}
const mapDispatchToProps = {
  getItems,
  getObject,
  setActChanged,
  addItem,
  updateItem,
  updateFolder,
  deleteObject
};

const mapStateToProps = ({entities: {data, objects, actChanged, auth, volume}}, ownProps) => ({
  act: data && data[ownProps.actId],
  changed: actChanged,
  user: auth || {},
  volume: volume,
  screensHash: (objects && objects[`folder/${ownProps.actId}`]) || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(EditAct);
