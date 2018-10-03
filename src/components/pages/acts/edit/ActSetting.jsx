import React, { Component } from 'react';
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
    const {setting, onSetting, onFormRef} = this.props;
    return (
      <div className="setting">
        <ul className="scroll-to-list">
          <ScrollLink to="information">Information</ScrollLink>
          <ScrollLink to="user-notifications">User notifications</ScrollLink>
          <ScrollLink to="user-settings">User settings</ScrollLink>
          <ScrollLink to="display-settings">Display Settings</ScrollLink>
        </ul>
        <SettingForm initialValues={setting} onSubmit={onSetting} ref={ref => {
          ref && onFormRef(ref);
          }
        }/>
      </div>
    );
  }
}

export default ActSetting;