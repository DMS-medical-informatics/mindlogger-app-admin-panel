import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import {InputRow, InputTextField} from '../../../../../forms/Material';
import PadBlock from '../../../../../layout/PadBlock';
import validate from './validate';

class SurveySliderSecondForm extends Component {
  renderOptions() {
    let options = [];
    const {options_count} = this.props.body;
    for(let i=0; i < options_count ; i++) {
      options.push(
        <InputRow label={`Label ${i+1}:`} key={i+1}>
          <Field name={`options[${i}].text`} component={InputTextField} type="text"/>
        </InputRow>);
    }
    return options;
  }

  renderAdvanceScreen() {
    let items = [];
    const {options_count, increments} = this.props.body;
    for(let i=0; i < options_count ; i++) {
      items.push((
        <InputRow key={i*2}>
          <Grid item xs={6}>
            Label {i+1}:
          </Grid>
          <PadBlock>
            <Field name={`options[${i}].screen`} component={InputTextField} type="number" placeholder="1"/>
          </PadBlock>
        </InputRow>
      ));
      if (increments === 'smooth' && i < options_count-1) {
        items.push((
          <InputRow key={i*2+1}>
          <Grid item xs={6}>
            between Label {i+1} & Label {i+2}:
          </Grid>
          <PadBlock>
            <Field name={`options[${i}].screen2`} component={InputTextField} type="number" placeholder="1"/>
          </PadBlock>
          </InputRow>
        ));
      }
      
    }
    return (<div>
      <p>Optionaly set screen to advance to, depending on which option is selected (default is next screen)</p>
      <Grid container alignItems="baseline">
        <Grid item xs={6}>
          If select
        </Grid>
        <Grid item xs={6}>
          Go to Screen #:
        </Grid>
      </Grid>
      {items}
    </div>);
  }
  render() {
    const {handleSubmit, submitting, previousPage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          Labels for the 3 tick marks
          <br/>
          (from left/bottom to right/top):
          { this.renderOptions() }
          { this.renderAdvanceScreen()}
          <div className="wizard-footer">
            <Button variant="contained" onClick={previousPage}>Back</Button>
            <Button variant="contained" color="primary" type="submit" disabled={submitting}>Submit</Button>
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
})(SurveySliderSecondForm);