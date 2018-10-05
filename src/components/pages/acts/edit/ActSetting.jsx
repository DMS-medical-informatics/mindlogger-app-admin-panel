import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import SettingForm from './SettingForm';
import ScrollLink from '../../../layout/ScrollLink';
class ActSetting extends Component {
  componentWillMount() {
    this.childRefs = {};
  }
  scrollTo(key){
    const el = document.querySelector(`#${key}`)
    if (el)
      el.scrollIntoView()
  }
  render() {
    const {setting, onSetting, onFormRef, onDelete} = this.props;
    return (
      <div className="setting">
        <ul className="scroll-to-list">
          <ScrollLink to="information">Information</ScrollLink>
          <ScrollLink to="user-notifications">User notifications</ScrollLink>
          <ScrollLink to="user-settings">User settings</ScrollLink>
          <ScrollLink to="display-settings">Display Settings</ScrollLink>
        </ul>
        <SettingForm 
          initialValues={setting}
          onSubmit={onSetting}
          onDelete={onDelete}
          info={setting && setting.info}
          ref={ref => {
          ref && onFormRef(ref);
          }
        }/>

        <div className="section-title">
          <a>Delete activity</a>
        </div>
        <div className="section-body">
          <Button variant="contained" color="secondary" onClick={onDelete}>Delete activity</Button>
        </div>
      </div>
    );
  }
}

export default ActSetting;