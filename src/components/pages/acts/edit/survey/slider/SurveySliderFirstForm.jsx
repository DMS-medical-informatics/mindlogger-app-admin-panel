import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import {InputTextField, InputRadioField, InputRow} from '../../../../../forms/Material';
import {isRequired} from '../../../../../forms/validation'
import validate from './validate';



class SurveySliderFirstForm extends Component {
  
  render() {
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          <Grid container alignItems="baseline">
            <Grid item xs={6}>
              Orientation
            </Grid>
            <Grid item>
              <Field name="orientation" label="Vertical" component={InputRadioField} select="vertical" />
              <br/>
              <Field name="orientation" label="Horizontal" component={InputRadioField} select="horizontal" />
            </Grid>
          </Grid>
          <Grid container alignItems="baseline">
            <Grid item xs={6}>
              Increments
            </Grid>
            <Grid item>
              <Field name="increments" label="Smooth" component={InputRadioField} select="smooth" />
              <br/>
              <Field name="increments" label="Discrete" component={InputRadioField} select="Discrete" />
            </Grid>
          </Grid>
          <InputRow label="Number of tic marks dividing bar (including edges):">
            <Field name="options_count" component={InputTextField} type="number" validate={isRequired} placeholder="1"/>
          </InputRow>

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
  form: 'survey-slider-form',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(SurveySliderFirstForm);