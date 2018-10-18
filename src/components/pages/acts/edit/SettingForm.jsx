import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import {Row, Col} from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';

import { InputField } from '../../../forms/FormItems';
import {InputCheckField, InputRadioField, InputTextField, InputRow} from '../../../forms/Material';
import InputTimeField from '../../../forms/InputTimeField';
import {isRequired} from '../../../forms/validation';
import InputWeekdayField from './InputWeekdayField';
import InputMonthDayField from './InputMonthDayField';
import PadBlock from '../../../layout/PadBlock';

const renderTimes = ({ fields, meta: { error } }) => (
  <div>
    <InputRow>
      Times of day:<Button onClick={() => fields.push()}><AddIcon/></Button>
    </InputRow>
    <PadBlock>
    {fields.map((obj, index) => (
      <div key={index}>
        <InputRow>
        Time #{index+1}<Button onClick={() => fields.remove(index)}><RemoveIcon/></Button>
        </InputRow>
        <Grid container alignItems="baseline">
          <Grid item sm={3}>
            <Field name={`${obj}.timeMode`} label="Scheduled:" component={InputRadioField} select="scheduled"/>
          </Grid>
          <Grid item>
            <Field name={`${obj}.time`} component={InputTimeField}/>
          </Grid>
        </Grid>
        <Grid container alignItems="baseline">
          <Grid item sm={3}>
            <Field name={`${obj}.timeMode`} label="Random:" component={InputRadioField} select="random"/>
          </Grid>
          <Grid item>
            Start:
            <Field name={`${obj}.timeStart`} component={InputTimeField}/>
            <br/>
            End:
            <Field name={`${obj}.timeEnd`} component={InputTimeField}/>
          </Grid>
        </Grid>
        
      </div>))}
    
    {error && <li className="error">{error}</li>}
    </PadBlock>
  </div>
)
class SettingForm extends Component {
  render() {
    const {handleSubmit, submitting, onDelete, info} = this.props
    return (
      <form onSubmit={ handleSubmit }>
        {info != true &&
        <div className="section-title"><a id="information">Information</a></div>
        }
        <Row>
          <Col md={8}>
            <Field name="abbreviation" type="text" label="Short name(max 20 characters)" component={InputField} className="form-control-auto" />
            <Field name="name" type="text" label="Full name:" validate={isRequired} component={InputField} />
            <Field name="description" componentClass="textarea" label="Description:" component={InputField} />
          </Col>
        </Row>
        { info != true && 
        (<div>
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
            
              <FieldArray name="notification[times]" component={renderTimes} />
            <PadBlock>
              <Field name="notification[resetTime]" label="User can reset time" component={InputCheckField} />
            </PadBlock>
            Reminders
            <PadBlock>
              <InputRow>
                <Field name="notification[advance]" label="Advance notification:" component={InputCheckField} inline/>
                <Field name="notification[advanceMin]" type="number"component={InputTextField}/>
                minutes
              </InputRow>
              <InputRow>
                <Field name="notification[dailyReminder]" label="Daily reminder for missed activity for up to:" component={InputCheckField} inline/>
                <Field name="notification[dailyReminderDays]" type="number"component={InputTextField}/>
                days
              </InputRow>
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
        </div>)
        }
        
      </form>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'setting-form'
})(SettingForm);