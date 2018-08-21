import React, { Component } from 'react';
import SettingForm from './SettingForm';

class ActSetting extends Component {
  render() {
    const {setting, onSetting} = this.props;
    return (
      <div className="setting">
        <ul>
          <li><a href="#information">Information</a></li>
          <li><a href="#user-notifications">User notifications</a></li>
          <li><a href="#user-settings">User settings</a></li>
          <li><a href="#display-settings">Display Settings</a></li>
        </ul>
        <SettingForm initialValues={setting} onSubmit={onSetting}/>
      </div>
    );
  }
}

export default ActSetting;