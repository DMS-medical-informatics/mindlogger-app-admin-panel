import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';

import { InputField, InputRadioField } from '../../../../../forms/FormItems';
import InputFileField from '../../../../../forms/InputFileField';


class SurvyeListBasicForm extends Component {
  renderOptions() {
    let options = [];
    const {options_count} = this.props.body;
    for(let i=0; i < options_count ; i++) {
      options.push((
        <Grid container key={i+1} alignItems="baseline">
          <Grid item sm={2}>
            Option {i+1}:
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Field name={`options[${i}].type`} label="Text" component={InputRadioField} select="text" />
              </Grid>
              <Grid item>
                <Field name={`options[${i}].text`} component={InputField} type="text" inline/>
              </Grid>
            </Grid>
            
            <Grid container alignItems="center">
              <Field name={`options[${i}].type`} label="File" component={InputRadioField} select="file" />
              <Field name={`options[${i}].file`} component={InputFileField} />
            </Grid>
          </Grid>
        </Grid>
      ))
    }
    return options;
  }

  renderAdvanceScreen() {
    let items = [];
    const {options_count} = this.props.body;
    for(let i=0; i < options_count ; i++) {
      items.push((
        <Grid container key={i+1} alignItems="baseline">
          <Grid item xs={10}>
            Option {i+1}:
          </Grid>
          <Grid item xs={2}>
            <Field name={`options[${i}].screen`} component={InputField} type="number" inline/>
          </Grid>
        </Grid>
      ))
    }
    return items;
  }
  render() {
    const {handleSubmit, submitting, body:{options_max_count}, previousPage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          Enter text or upload pictures for the 2 response options
          { this.renderOptions() }
          { options_max_count === '1' && <div>
            <p>Optionaly set screen to advance to, depending on which option is selected (default is next screen)</p>
            <Grid container alignItems="baseline">
              <Grid item xs={9}>
                If select
              </Grid>
              <Grid item xs={3}>
                Go to Screen #:
              </Grid>
            </Grid>
          {this.renderAdvanceScreen()}
          </div> }
          <div className="wizard-footer">
            <Button color="secondary" onClick={previousPage}>Back</Button>
            <Button color="primary" type="submit" disabled={submitting}>Submit</Button>
          </div>
        </div>
      </form>
    );
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'survey-list-form',
  destoryOnUnmount: false,
})(SurvyeListBasicForm);