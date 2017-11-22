import React,{Component} from 'react'
import { Field, reduxForm } from 'redux-form'

import {InputField} from './FormItems'
import {isRequired} from './validation'
class AddFolder extends Component {
    componentWillMount() {
        this.setState({})
    }
    render () {
        const { handleSubmit } = this.props
        return (
            <form onSubmit={ handleSubmit }>
            <Field name="name" type="text" component={InputField} label="Name" placeholder="name" validate={isRequired} />
            </form>
        )
    }
}

AddFolder = reduxForm({
  // a unique name for the form
  form: 'add-folder-form'
})(AddFolder)

export default AddFolder;