import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import cn from 'classnames';

import {InputRow, InputTextField, InputRadioField} from '../../../../../forms/Material';
import InputFileField from '../../../../../forms/GInputFileField';
import validate from './validate';

class SurveyTableSelectCellForm extends Component {
  componentWillMount() {
    this.setState({row:0, col:0});
  }
  renderGrid() {
    const { body:{rowsCount, colsCount} } = this.props;
    const {row, col} = this.state;
    let rows = [];
    for(let i=0; i < rowsCount ; i++) {
      let cols = [];
      for(let j=0; j < colsCount ; j++) {
        cols.push(<div className={cn('cell', {selected: row === i && col === j })} key={j} onClick={() => this.selectCell(i,j)}>
          
        </div>);
      }
      rows.push(<div className="table-row" key={i}>{cols}</div>);
    }
    return (<div className="table-grid">{rows}</div>);
  }

  renderInputs() {
    const { body: {rowsCount, colsCount}, screenId } = this.props;
    const dataForFile = {parentType:'item', parentId: screenId};
    const {row, col} = this.state
    let inputs = [];
    for(let i=0; i < rowsCount ; i++) {
      for(let j=0; j < colsCount ; j++) {
        inputs.push(<div key={`${i}_${j}`} className={cn({hidden: (row !== i || col !== j) })}>
          <InputRow>
            <Field name={`rows[${i}][${j}].type`} label="Text" component={InputRadioField} select="text" />
            <Field name={`rows[${i}][${j}].text`} component={InputTextField} type="text" placeholder="Text"/>
          </InputRow>
          <InputRow>
            <Field name={`rows[${i}][${j}].type`} label="Picture" component={InputRadioField} select="file" />
            <Field name={`rows[${i}][${j}].file`} component={InputFileField} data={dataForFile}/>
          </InputRow>
        </div>)
      }
    }
    return inputs;
  }

  selectCell(row, col) {
    this.setState({row,col})
  }

  render() {
    const {handleSubmit, submitting, previousPage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          Select each table cell and enter text or upload a picture:
          { this.renderGrid() }
          { this.renderInputs() }
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
})(SurveyTableSelectCellForm);
