import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';

import {isRequired} from '../../../forms/validation';
import { InputField } from '../../../forms/FormItems';


class AddUserForm extends Component {

  render () {
    const {handleSubmit} = this.props
    return (
        <form onSubmit={ handleSubmit }>

          <Field name="login" type="text" component={InputField} label="Username" placeholder="" validate={isRequired} />
          <Field name="firstName" type="text" component={InputField} label="First Name" placeholder="" validate={isRequired} />
          <Field name="lastName" type="text" component={InputField} label="Last Name" placeholder="" validate={isRequired} />
          <Field name="email" type="email" component={InputField} label="Email" placeholder="" validate={isRequired} />
          <Field name="password" type="password" component={InputField} label="Password" placeholder="" validate={isRequired} />
          <Button variant="contained" color="primary" type="submit">Add</Button>
        </form>
    )
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'add-user-form'
})(AddUserForm)
