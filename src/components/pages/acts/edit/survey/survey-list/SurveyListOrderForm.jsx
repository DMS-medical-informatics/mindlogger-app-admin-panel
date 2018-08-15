import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {Button} from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';
import cn from 'classnames';

import { InputField} from '../../../../../forms/FormItems';
import {InputRow, InputTextField, InputRadioField} from '../../../../../forms/Material';
import InputFileField from '../../../../../forms/InputFileField';
import PadBlock from '../../../../../layout/PadBlock';
import { isRequired } from '../../../../../../helpers/index';
import validate from './validate';

class SurveyListOrderForm extends Component {

  renderAdvanceScreen() {
    let items = [];
    const {options_count} = this.props.body;
    for(let i=0; i < options_count ; i++) {
      items.push((
        <InputRow key={i+1}>
          <Grid item xs={6}>
            Option {i+1}:
          </Grid>
          <PadBlock>
            <Field name={`options[${i}].screen`} component={InputTextField} type="number" placeholder={`${i+2}`}/>
          </PadBlock>
        </InputRow>
      ))
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
    const {handleSubmit, submitting, body:{options_max_count}, previousPage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          Enter text or upload pictures for the 2 response options
          <Field name="response_type" label="Text Response Option" component={InputRadioField} select="text" validate={isRequired}/>
          <PadBlock>
            <p>Specify the order that text options are presented with a text file in the format below, with bracketed lists of comma-separated text strings. Example: present two text strings three possible ways: [string 1, string 2], [string 2, string 1], [string 3, string 2]</p>
            <Field name="text_file" label="Upload text file" component={InputFileField} validate={isRequired}/>
          </PadBlock>
          <Field name="response_type" label="Picture Response Option" component={InputRadioField} select="picture" validate={isRequired}/>
          <PadBlock>
            <p>Specify the order that pictures are presented with a text file in the format below, with bracketed lists of comma-separated file names. Example: present two pictures two possible ways: [pic31.jpg, pic12.jpg], [pic7.jpg, pic83.jpg]</p>
            <Field name="picture_file" label="Upload picture file" component={InputFileField} validate={isRequired}/>
          </PadBlock>
          <br/>
          { options_max_count === '1' && 
            this.renderAdvanceScreen()
           }
          <div className="wizard-footer">
            <Button color="secondary" onClick={previousPage}>Back</Button>
            <Button color="primary" type="submit">Submit</Button>
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
})(SurveyListOrderForm);