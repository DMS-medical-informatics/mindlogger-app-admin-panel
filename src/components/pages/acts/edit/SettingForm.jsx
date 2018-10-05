import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {Row, Col} from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';

import { InputField } from '../../../forms/FormItems';
import {InputCheckField, InputRadioField, InputTextField} from '../../../forms/Material';
import InputTimeField from '../../../forms/InputTimeField';
import {isRequired} from '../../../forms/validation';
import InputWeekdayField from './InputWeekdayField';
import InputMonthDayField from './InputMonthDayField';
import PadBlock from '../../../layout/PadBlock';
import Button from '@material-ui/core/Button';

class SettingForm extends Component {
  render() {
    const {handleSubmit, submitting, onDelete} = this.props
    return (
      <form onSubmit={ handleSubmit }>
        <div className="section-title"><a id="information">Information</a></div>
        <Row>
          <Col md={8}>
            <Field name="abbreviation" type="text" label="Short name(max 20 characters)" validate={isRequired} component={InputField} className="form-control-auto" />
            <Field name="name" type="text" label="Full name:" validate={isRequired} component={InputField} />
            <Field name="description" componentClass="textarea" label="Description:" validate={isRequired} component={InputField} />
          </Col>
        </Row>

        <div className="section-title">
          <Row>
            <Col sm={6}>
              <a id="user-notifications">User notifications</a>
            </Col>
          </Row>
        </div>
        <div className="section-body">
          Day of the week, month, or specific dates;
          <PadBlock>
            <Grid container alignItems="baseline">
              <Field name="notification[modeWeek]" label="Weekly:" component={InputCheckField}/>
              <Field name="notification[weekDay]" component={InputWeekdayField} bordered/>
            </Grid>
            <Grid container alignItems="baseline">
              <Field name="notification[modeMonth]" label="Monthly:" component={InputCheckField}/>
              <Field name="notification[monthDay]" component={InputMonthDayField} bordered/>
            </Grid>
            <Grid container>
            <Field name="notification[modeDate]" label="Calendar date:" component={InputCheckField} select="calendar_date"/>
            <Field name="notification[calendarDay]" component={InputTextField} type="date" />
            </Grid>
            <Field name="notification[resetDate]" label="User can reset day/dates" component={InputCheckField} />
          </PadBlock>
          <Grid container alignItems="baseline">
            <div>Times of day:</div>
            <div className="num-input-wrapper inline-block">
              <Field name="notification[countPerDay]" type="number" component={InputField} inline/>
            </div>
            <div>times per day</div>
          </Grid>
          <PadBlock>
            <Grid container alignItems="baseline">
              <Grid item sm={3}>
                <Field name="notification[timeMode]" label="Scheduled:" component={InputRadioField} select="scheduled"/>
              </Grid>
              <Grid item>
                <Field name="notification[time]" component={InputTimeField}/>
              </Grid>
            </Grid>
            <Grid container alignItems="baseline">
              <Grid item sm={3}>
                <Field name="notification[timeMode]" label="Random:" component={InputRadioField} select="random"/>
              </Grid>
              <Grid item>
                Start:
                <Field name="notification[timeStart]" component={InputTimeField}/>
                <br/>
                End:
                <Field name="notification[timeEnd]" component={InputTimeField}/>
              </Grid>
            </Grid>
            <Field name="notification[resetTime]" label="User can reset time" component={InputCheckField} />
          </PadBlock>
          Reminders
          <PadBlock>
            <div className="num-input-wrapper">
              <Field name="notification[advance]" label="Advance notification:" component={InputCheckField} inline/>
              <Field name="notification[advanceMin]" type="number"component={InputField} inline/>
              &nbsp; minutes
            </div>
            <div className="num-input-wrapper">
              <Field name="notification[dailyReminder]" label="Daily reminder for missed activity for up to:" component={InputCheckField} inline/>
              <Field name="notification[dailyReminderDays]" type="number"component={InputField} inline/>
              &nbsp; days
            </div>
          </PadBlock>
        </div>

        <div className="section-title">
          <a id="user-settings">User settings</a>
        </div>
        <div className="section-body">
          <p>User can resume an Activity later:</p>
          <PadBlock>
            <Field name="resumeMode" label="cannot resume later" component={InputRadioField} select="not"/>
            <br/>
            <Field name="resumeMode" label="from the beginning" component={InputRadioField} select="start"/>
            <br/>
            <Field name="resumeMode" label="where left off, going forward" component={InputRadioField} select="forward"/>
            <br/>
            <Field name="resumeMode" label="where left off, going forward or backward" component={InputRadioField} select="free"/>
            <br/>
            <Field name="resumeMode" label="only skipped portions and remainder" component={InputRadioField} select="remainder"/>
          </PadBlock>
          <Field name="permission[font]" label="User can change font size in the app" component={InputCheckField} />
          <br/>
          <Field name="permission[delete]" label="Users can delete all of their data on the server" component={InputCheckField} />
        </div>

        <div className="section-title">
          <a id="display-settings">Display settings</a>
        </div>
        <div className="section-body">
          <Field name="permission[skip]" label="Allow skipping screens" component={InputCheckField} />
          <br/>
          <Field name="permission[prev]" label="Allow returning to previous screens" component={InputCheckField} />
          <br/>
          <Field name="display[progress]" label="Show progress bar on top (for survey screens)" component={InputCheckField} />
        </div>

        <div className="section-title">
          <a>Delete activity</a>
        </div>
        <div className="section-body">
          <Button variant="contained" color="secondary" onClick={onDelete}>Delete activity</Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'setting-form'
})(SettingForm);