import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';

import {InputRadioField} from '../../../../../forms/Material';
import InputFileField from '../../../../../forms/GInputFileField';
import PadBlock from '../../../../../layout/PadBlock';
import { isRequired } from '../../../../../../helpers/index';
import validate from './validate';

class SurveyTableOrderForm extends Component {

  render() {
    const {handleSubmit, submitting, previousPage, screenId} = this.props;
    const dataForFile = {parentType:'item', parentId: screenId};
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          <Field name="responseType" label="Text tables" component={InputRadioField} select="text"/>
          <PadBlock>
            <p>Specify the order that text entries are presented with a text file in the format below, with bracketed lists of comma-separated text strings. Example: present 2-column by 3-row table of text strings two different ways: [[string 1, string 2], [string 3, string 4], [string 5, string 6], [string 5, string 1], [string 4, string 3], [string 6, string 2]]</p>
            <Field name="textOrderFile" label="Upload text file" component={InputFileField} validate={isRequired} data={dataForFile}/>
          </PadBlock>
          <Field name="responseType" label="Picture tables" component={InputRadioField} select="picture"/>
          <PadBlock>
            <p>Specify the order that pictures are presented with a text file in the format below, with bracketed lists of comma-separated file names. Example: present two pictures two possible ways: [pic31.jpg, pic12.jpg], [pic7.jpg, pic83.jpg]</p>
            <Field name="pictureOrderFile" label="Upload text file" component={InputFileField} validate={isRequired} data={dataForFile}/>
            <Field name="pictureFiles" label="Upload picture file" component={InputFileField} validate={isRequired} data={dataForFile}/>
          </PadBlock>
          <div className="wizard-footer">
          <Button variant="contained" onClick={previousPage}>Back</Button>
          <Button variant="contained" color="primary" type="submit" disabled={submitting}>Done</Button>
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
})(SurveyTableOrderForm);
