import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {FormGroup, Button,Row, Col} from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';
import cn from 'classnames';

import { InputField } from '../../../../../forms/FormItems';
import {InputTextField, InputRadioField, InputRow} from '../../../../../forms/Material';
import {isRequired} from '../../../../../forms/validation'
import validate from './validate';


class SurveyListTypeForm extends Component {
  
  render() {
    const {handleSubmit, submitting} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          <InputRow label="Number of response options:" row={8}>
            <Field name="options_count" component={InputTextField} type="number" validate={isRequired} placeholder="2"/>
          </InputRow>
          <InputRow label="Maximum number of options to select:" row={8}>
            <Field name="options_max_count" component={InputTextField} type="number" validate={isRequired} placeholder="1"/>
          </InputRow>
          <InputRow label="Minimum number of options to select:" row={8}>
          <Field name="options_min_count" component={InputTextField} type="number" inline validate={isRequired} placeholder="1"/>
          </InputRow>
          
          <Field name="mode" label="Enter text or upload pictures for a single set of response options" component={InputRadioField} select="single" />
          <Field name="mode" label="Specify order for multiple presentations of text or picture response options" component={InputRadioField} select="order" />
          <div className="wizard-footer">
            <Button color="primary" type="submit">Next</Button>
          </div>
        </div>
      </form>
    );
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'survey-list-form',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(SurveyListTypeForm);