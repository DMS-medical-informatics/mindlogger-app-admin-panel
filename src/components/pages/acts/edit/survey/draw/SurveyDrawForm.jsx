import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';

import {InputRadioField, InputRow} from '../../../../../forms/Material';
import {isRequired} from '../../../../../forms/validation'
import PadBlock from '../../../../../layout/PadBlock';
import InputFileField from '../../../../../forms/InputFileField';



class SurveyDrawForm extends Component {
  
  render() {
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          <Field name="mode" label="Draw on a blank canvas" component={InputRadioField} select="blank" validate={isRequired}/>
          <br/>
          <Field name="mode" label="Draw on a picture" component={InputRadioField} select="picture" />
          <PadBlock>
            <InputRow>
              <Field name="picture_mode" label="Upload single picture" component={InputRadioField} select="single" />
              <Field name="picture_file" component={InputFileField} />
            </InputRow>
          </PadBlock>
          <Field name="mode" label="Draw on a camera photo" component={InputRadioField} select="camera" />

          <div className="wizard-footer">
            <Button variant="contained" color="primary" type="submit">Done</Button>
          </div>
        </div>
      </form>
    );
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'survey-draw-form',
})(SurveyDrawForm);