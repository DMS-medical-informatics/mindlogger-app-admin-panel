import React, { Component } from 'react'
import { compose } from "redux"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { withRouter } from "react-router"

import { signup } from "../actions/api"
import {InputField} from './forms/FormItems'
import { isValidEmail, isRequired } from "../helpers"
import { InputCheckField } from './forms/Material';

function setErrorMsg(error) {
  return {
    registerError: error.message
  }
}

class Register extends Component {
  state = { registerError: null }
  submit = (values) => {
    const {history, signup} = this.props
    signup({...values, admin: false})
    .then(res => {
      history.push('/users')
    })
    .catch(e => this.setState(setErrorMsg(e)))
  }
  render () {
    const {handleSubmit} = this.props
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1>Register</h1>
        <form onSubmit={handleSubmit(this.submit)}>
        <Field name="login" type="text" component={InputField} label="Username" placeholder="Username" validate={isRequired} />
        <Field name="email" type="text" component={InputField} label="Email" placeholder="Email" validate={isValidEmail} />
        <Field name="firstName" type="text" component={InputField} label="First name" placeholder="" validate={isRequired} />
        <Field name="lastName" type="text" component={InputField} label="Last name" placeholder="" validate={isRequired} />
        <Field name="password" type="password" component={InputField} label="Password" placeholder="Email" validate={isRequired} />
        
          {
            this.state.registerError &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.registerError}
            </div>
          }
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = {
  signup
}

export default compose(
  reduxForm({
    form: "signup-form"
  }),
  withRouter,
  connect(null, mapDispatchToProps)
)(Register)