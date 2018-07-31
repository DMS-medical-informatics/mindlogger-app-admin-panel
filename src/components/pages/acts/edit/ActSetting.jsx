import React, { Component } from 'react';
import SettingForm from './SettingForm';

class ActSetting extends Component {
  render() {
    return (
      <div className="setting">
        <ul>
          <li><a href="#information">Information</a></li>
          <li><a href="#user-notifications">User notifications</a></li>
          <li><a href="#user-settings">User settings</a></li>
          <li><a href="#display-settings">Display Settings</a></li>
        </ul>
        <SettingForm />
      </div>
    );
  }
}

export default ActSetting;