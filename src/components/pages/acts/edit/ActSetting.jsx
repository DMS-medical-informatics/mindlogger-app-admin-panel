import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

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
          <ConfirmButton onClick={onDelete} text="Are you SURE you want to delete this activity?" buttonText="Delete activity" />
        </div>
      </div>
    );
  }
}

export default ActSetting;