import React, { Component } from 'react'
import { compose } from "redux"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { withRouter } from "react-router"

import { isRequired } from "../helpers"
import { signin, forgotPassword } from "../actions/api"
import { InputField } from "./forms/FormItems"
function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

class Login extends Component {
  state = { loginMessage: null }
  submit = (body) => {
    const { history, signin } = this.props
    return signin(body).then(res => history.push('/library'))
      .catch((error) => {
          console.log(error)
          this.setState(setErrorMsg(error.message))
        })
  }
  
  forgotPassword = () => {
    const {forgotPassword} = this.props
    forgotPassword({email: this.email.value})
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  }

  render () {
    const {handleSubmit} = this.props
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> Login </h1>
        <form onSubmit={handleSubmit(this.submit)}>
        <Field name="user" type="text" component={InputField} label="Username" placeholder="Username" validate={isRequired} />
        <Field name="password" type="password" component={InputField} label="Password" placeholder="Email" validate={isRequired} />
          {
            this.state.loginMessage &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage} <a href="#" onClick={this.forgotPassword} className="alert-link">Forgot Password?</a>
            </div>
          }
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = {
  signin, forgotPassword
}

export default compose(
  reduxForm({
    form: "login-form"
  }),
  withRouter,
  connect(null, mapDispatchToProps)
)(Login)
