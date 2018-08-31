import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';

import {InputRow, InputTextField} from '../../../../../forms/Material';
import PadBlock from '../../../../../layout/PadBlock';
import validate from './validate';

class SurvyeListBasicForm extends Component {
  renderRows() {
    let options = [];
    const {rowsCount} = this.props.body;
    for(let i=0; i < rowsCount ; i++) {
      options.push((
        <InputRow label={`Row ${i+1}:`} key={i} row={6}>
          <Field name={`rows[${i}]`} label="Text" component={InputTextField} placeholder="Label" />
        </InputRow>
      ));
    }
    return options;
  }

  renderCols() {
    let options = [];
    const {colsCount} = this.props.body;
    for(let i=0; i < colsCount ; i++) {
      options.push((
        <InputRow label={`Col ${i+1}:`} key={i} row={6}>
          <Field name={`cols[${i}]`} label="Text" component={InputTextField} placeholder="Label" />
        </InputRow>
      ));
    }
    return options;
  }

  render() {
    const {handleSubmit, submitting, previousPage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          Optional row and column labels:
          <PadBlock>
            { this.renderRows() }
            { this.renderCols() }
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
})(SurvyeListBasicForm);