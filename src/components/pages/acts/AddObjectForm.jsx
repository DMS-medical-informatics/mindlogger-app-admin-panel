import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button';
import { InputRow, InputTextField } from '../../forms/Material';
import { isRequired } from '../../forms/validation';

class AddObjectForm extends Component {
  static propTypes = {
    title: PropTypes.string
  }
  
  render() {
    const {handleSubmit, submitting, pristine} = this.props;
    return (
      <form onSubmit={handleSubmit}>
      <div className="wizard">
        <InputRow label="Title" row={4}>
          <Field name="name" component={InputTextField} validate={isRequired} />
        </InputRow>
        <div className="wizard-footer">
          <Button variant="contained" color="primary" type="submit" disabled={submitting || pristine}>Submit</Button>
        </div>
      </div>
      </form>
    )
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'add-object-form'
})(AddObjectForm);