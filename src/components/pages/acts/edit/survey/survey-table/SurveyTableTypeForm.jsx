import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';

import {InputTextField, InputRadioField, InputRow} from '../../../../../forms/Material';
import {isRequired} from '../../../../../forms/validation'
import validate from './validate';
import PadBlock from '../../../../../layout/PadBlock';

class SurveyTableTypeForm extends Component {
  
  render() {
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          <InputRow label="Table Shape:" row={4}>
            <Field name="rowsCount" component={InputTextField} type="number" validate={isRequired} placeholder="2"/>
            rows,
            <Field name="colsCount" component={InputTextField} type="number" validate={isRequired} placeholder="2"/>
            columns
          </InputRow>
          Response type:
          <PadBlock>
            <Field name="mode" label="Enter text in each table cell" component={InputRadioField} select="text" />
            <Field name="mode" label="Tap to increment integers in each table cell" component={InputRadioField} select="number" />
            <Field name="mode" label="Select text/pictures per row" component={InputRadioField} select="select" />
          </PadBlock>
          <div className="wizard-footer">
            <Button variant="contained" color="primary" type="submit">Next</Button>
          </div>
        </div>
      </form>
    );
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'survey-table-form',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(SurveyTableTypeForm);