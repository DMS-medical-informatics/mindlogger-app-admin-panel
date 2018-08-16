import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import {InputRow, InputTextField, InputRadioField} from '../../../../../forms/Material';
import PadBlock from '../../../../../layout/PadBlock';
import { isRequired } from '../../../../../../helpers/index';
import validate from './validate';

class SurveyTableSelectForm extends Component {
  renderRows() {
    let options = [];
    const {rows_count} = this.props.body;
    for(let i=0; i < rows_count ; i++) {
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
    const {cols_count} = this.props.body;
    for(let i=0; i < cols_count ; i++) {
      options.push((
        <InputRow label={`Col ${i+1}:`} key={i} row={6}>
          <Field name={`cols[${i}]`} label="Text" component={InputTextField} placeholder="Label" />
        </InputRow>
      ));
    }
    return options;
  }

  render() {
    const {handleSubmit, submitting,  previousPage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          Optional row and column labels:
          <PadBlock>
            {this.renderRows()}
            {this.renderCols()}
          </PadBlock>
          <InputRow>
            <Grid item>
              Minimum number of options to select per row
            </Grid>
            <Field name="min_select" type="number" component={InputTextField} placeholder="1" validate={isRequired}/>
          </InputRow>
          <InputRow>
            <Grid item>
              Maximum number of options to select per row
            </Grid>
            <Field name="max_select" type="number" component={InputTextField} placeholder="1" validate={isRequired} />
          </InputRow>
          <Field name="select_type" label="Populate individual table cells with text/pictures" component={InputRadioField} select="basic" validate={isRequired}/>
          <Field name="select_type" label="Specify the order for multiple presentations of text or pictures" component={InputRadioField} select="order" validate={isRequired}/>
          <div className="wizard-footer">
          <Button variant="contained" onClick={previousPage}>Back</Button>
          <Button variant="contained" color="primary" type="submit" disabled={submitting}>Next</Button>
          </div>
        </div>
      </form>
    );
  }
}
const SurveyTableSelectReduxForm = reduxForm({
  // a unique name for the form
  form: 'survey-table-form',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(SurveyTableSelectForm);

const selector = formValueSelector('survey-list-form');
export default connect(
    state => {
        const max_select = selector(state, 'max_select')
        return { max_select }
    }
)(SurveyTableSelectReduxForm);