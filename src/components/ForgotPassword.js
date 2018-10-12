import React, { Component } from 'react'
import { compose } from "redux"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import { withRouter } from "react-router"

import { isRequired } from "../helpers"
import { signin, forgotPassword } from "../actions/api"
import { InputField } from "./forms/FormItems"
import { Alert } from 'react-bootstrap';
function setErrorMsg(error) {
  return {
    message: error
  }
}

class ForgotPassword extends Component {
  state = { message: null }
  submit = ({email}) => {
    const {history, forgotPassword} = this.props;
    return forgotPassword({email}).then(res => history.push('/login'))
      .catch((error) => {
          console.log(error)
          this.setState(setErrorMsg(error.message))
        });
  }

  render () {
    const {handleSubmit} = this.props
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> ForgotPassword </h1>
        <form onSubmit={handleSubmit(this.submit)}>
        <Field name="email" type="text" component={InputField} label="Email" placeholder="Email" validate={isRequired} />
          {
            this.state.message &&
            <Alert bsStyle="warning">
              {this.state.message}
            </Alert>
          }
          <button type="submit" className="btn btn-primary">Submit</button>
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
    form: "ForgotPassword-form"
  }),
  withRouter,
  connect(null, mapDispatchToProps)
)(ForgotPassword)
