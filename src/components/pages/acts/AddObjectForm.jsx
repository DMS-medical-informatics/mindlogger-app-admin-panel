import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button';
import { InputRow, InputTextField, InputRadioField } from '../../forms/Material';
import { isRequired } from '../../forms/validation';

class AddObjectForm extends Component {
  static propTypes = {
    title: PropTypes.string
  }

  nameNew() {
    console.log(this);
  }

  render() {
    const {handleSubmit, submitting, pristine} = this.props;
    return (
      <form onSubmit={handleSubmit}>
      <div className="wizard">
        <InputRow row={4}>
          <Field name="plus" label="Select 1 Activity from Mindlogger Library" component={InputRadioField} select="select"/>
          <Field name="plus" label="Create new Activity:" component={InputRadioField} select="new"/><Field name="name" component={InputTextField} placeholder="New Activity Name"/>
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
  form: 'addObjectForm'
})(AddObjectForm);
