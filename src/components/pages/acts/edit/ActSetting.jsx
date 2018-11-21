import React, { Component } from 'react';

import SettingForm from './SettingForm';
import ScrollLink from '../../../layout/ScrollLink';
import ConfirmButton from '../../../controls/ConfirmButton';
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
    const {setting, onSetting, onFormRef, onDelete, info} = this.props;
    const isInfo = (setting && setting.info) || info
    console.log("setting", setting);
    return (
      <div className="setting">
        {!isInfo && (
        <ul className="scroll-to-list">
          <ScrollLink to="information">Information</ScrollLink>
          <ScrollLink to="user-notifications">User notifications</ScrollLink>
          <ScrollLink to="user-settings">User settings</ScrollLink>
          <ScrollLink to="display-settings">Display Settings</ScrollLink>
        </ul>)}
        <SettingForm 
          initialValues={setting}
          onSubmit={onSetting}
          onDelete={onDelete}
          info={isInfo}
          ref={ref => {
          ref && onFormRef(ref);
          }
        }/>

        <div className="section-title">
          <a>Delete activity</a>
        </div>
        <div className="section-body">
          <ConfirmButton variant="contained" color="secondary"  onClick={onDelete} text="Are you SURE you want to delete this activity?">Delete activity</ConfirmButton>
        </div>
      </div>
    );
  }
}

export default ActSetting;