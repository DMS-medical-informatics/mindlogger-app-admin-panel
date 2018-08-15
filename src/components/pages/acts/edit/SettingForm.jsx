import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {Button,Row, Col} from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';

import { InputField } from '../../../forms/FormItems';
import {InputCheckField, InputRadioField} from '../../../forms/Material';
import InputTimeField from '../../../forms/InputTimeField';
import {isRequired} from '../../../forms/validation';
import InputWeekdayField from './InputWeekdayField';
import InputMonthDayField from './InputMonthDayField';
import PadBlock from '../../../layout/PadBlock';

class SettingForm extends Component {
  render() {
    const {handleSubmit, submitting} = this.props
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
          Day of the week, month, or specific dates;
          <PadBlock>
            <Field name="notification[reset_time]" label="User can reset" component={InputCheckField} />
            <br/>
            <Grid container alignItems="baseline">
              <Field name="notification[mode_week]" label="Weekly:" component={InputCheckField} select="weekly"/>
              <Field name="notification[week_day]" component={InputWeekdayField} bordered/>
            </Grid>
            <Grid container alignItems="baseline">
              <Field name="notification[mode_month]" label="Monthly:" component={InputCheckField} select="monthly"/>
              <Field name="notification[month_day]" component={InputMonthDayField} bordered/>
            </Grid>
            <Field name="notification[mode_date]" label="Calendar date:" component={InputCheckField} select="calendar_date"/>
            <Field name="notification[reset_date]" label="User can reset day/dates" component={InputCheckField} />
          </PadBlock>
          <Grid container alignItems="baseline">
            <div>Times of day:</div>
            <div className="num-input-wrapper inline-block">
              <Field name="notification[count_per_day]" type="number" component={InputField} inline/>
            </div>
            <div>times per day</div>
          </Grid>
          <PadBlock>
            <Grid container alignItems="baseline">
              <Grid item sm={3}>
                <Field name="notification[time_mode]" label="Scheduled:" component={InputRadioField} select="scheduled"/>
              </Grid>
              <Grid item>
                <Field name="notification[time]" component={InputTimeField}/>
              </Grid>
            </Grid>
            <Grid container alignItems="baseline">
              <Grid item sm={3}>
                <Field name="notification[time_mode]" label="Random:" component={InputRadioField} select="random"/>
              </Grid>
              <Grid item>
                Start:
                <Field name="notification[time_start]" component={InputTimeField}/>
                <br/>
                End:
                <Field name="notification[time_end]" component={InputTimeField}/>
              </Grid>
            </Grid>
            <Field name="notification[reset_time]" label="User can reset time" component={InputCheckField} />
          </PadBlock>
          Reminders
          <PadBlock>
            <div className="num-input-wrapper">
              <Field name="notification[advance]" label="Advance notification:" component={InputCheckField} inline/>
              <Field name="notification[advance_min]" type="number"component={InputField} inline/>
              &nbsp; minutes
            </div>
            <div className="num-input-wrapper">
              <Field name="notification[daily_reminder]" label="Daily reminder for missed activity for up to:" component={InputCheckField} inline/>
              <Field name="notification[daily_reminder_days]" type="number"component={InputField} inline/>
              &nbsp; days
            </div>
          </PadBlock>
        </div>

        <div className="section-title">
          <a name="user-settings">User settings</a>
        </div>
        <div className="section-body">
          <p>User can resume an Activity later:</p>
          <PadBlock>
            <Field name="resume_mode" label="cannot resume later" component={InputRadioField} select="not"/>
            <br/>
            <Field name="resume_mode" label="from the beginning" component={InputRadioField} select="start"/>
            <br/>
            <Field name="resume_mode" label="where left off, going forward" component={InputRadioField} select="forward"/>
            <br/>
            <Field name="resume_mode" label="where left off, going forward or backward" component={InputRadioField} select="free"/>
            <br/>
            <Field name="resume_mode" label="only skipped portions and remainder" component={InputRadioField} select="remainder"/>
          </PadBlock>
          <Field name="change_font" label="User can change font size in the app" component={InputCheckField} />
          <br/>
          <Field name="allow_delete" label="Users can delete all of their data on the server" component={InputCheckField} />
        </div>

        <div className="section-title">
          <a name="display-settings">Display settings</a>
        </div>
        <div className="section-body">
          <Field name="skip_screen" label="Allow skipping screens" component={InputCheckField} />
          <br/>
          <Field name="previous_screen" label="Allow returning to previous screens" component={InputCheckField} />
          <br/>
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