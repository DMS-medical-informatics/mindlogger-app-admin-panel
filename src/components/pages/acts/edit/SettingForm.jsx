import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {FormGroup, Button,Row, Col} from 'react-bootstrap';
import { InputField, InputCheckField, InputRadioField } from '../../../forms/FormItems';
import InputTimeField from '../../../forms/InputTimeField';
import {isRequired} from '../../../forms/validation'

class SettingForm extends Component {
  render() {
    const {handleSubmit, submitting, index} = this.props
    return (
      <form onSubmit={ handleSubmit }>
        <div className="section-title"><a name="information">Information</a></div>
        <Row>
          <Col md={6}>
            <Field name="short_name" type="text" label="Short name(max 20 characters)" validate={isRequired} component={InputField} className="form-control-auto" />
            <Field name="name" type="text" label="Full name:" validate={isRequired} component={InputField} />
            <Field name="description" componentClass="textarea" label="Description:" validate={isRequired} component={InputField} />
          </Col>
        </Row>

        <div className="section-title">
          <Row>
            <Col sm={6}>
              <a name="user-notification">User notifications</a>
            </Col>
            <Col sm={6}>
              User can reset
            </Col>
          </Row>
        </div>
        <div className="section-body">
          <Row>
            <Col md={6}>
              <div className="num-input-wrapper inline-block">
                Time:
                <Field name="notification[time]" component={InputTimeField}/>
              </div>
            </Col>
            <Col md={6}>
            <Field name="notification[reset_time]" label="" component={InputCheckField} />
            </Col>
          </Row>
          <Field name="notification[mode]" label="Weekly:" component={InputRadioField} value="weekly"/>
          <Field name="notification[mode]" label="Monthly:" component={InputRadioField} value="monthly"/>
          <Field name="notification[mode]" label="Calendar Dates:" component={InputRadioField} value="calendar_date"/>
          <Field name="notification[mode]" label="Random:" component={InputRadioField} value="random"/>
          <Field name="notification[advance]" label="Advance notification:" component={InputCheckField} />
          <Field name="notification[daily_reminder]" label="Daily reminder for missed activity for up to:" component={InputCheckField} />
        </div>

        <div className="section-title">
          <a name="user-settings">User settings</a>
        </div>
        <div className="section-body">
          <p>User can resume an Activity later:</p>
          <Field name="resume_mode" label="cannot resume later" component={InputRadioField} value="not"/>
          <Field name="resume_mode" label="from the beginning" component={InputRadioField} value="start"/>
          <Field name="resume_mode" label="where left off, going forward" component={InputRadioField} value="forward"/>
          <Field name="resume_mode" label="where left off, going forward or backward" component={InputRadioField} value="free"/>
          <Field name="resume_mode" label="only skipped portions and remainder" component={InputRadioField} value="remainder"/>
          <Field name="change_font" label="User can change font size in the app" component={InputCheckField} />
          <Field name="allow_delete" label="Users can delete all of their data on the server" component={InputCheckField} />
        </div>

        <div className="section-title">
          <a name="display-settings">Display settings</a>
        </div>
        <div className="section-body">
          <Field name="skip_screen" label="Allow skipping screens" component={InputCheckField} />
          <Field name="previous_screen" label="Allow returning to previous screens" component={InputCheckField} />
          <Field name="progress_bar" label="Show progress bar on top (for survey screens)" component={InputCheckField} />
        </div>
        <Button type="submit" disabled={submitting}>Submit</Button>
      </form>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'setting-form'
})(SettingForm);