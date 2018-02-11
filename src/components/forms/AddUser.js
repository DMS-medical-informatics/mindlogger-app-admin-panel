import React,{Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import {FormGroup, FormControl} from 'react-bootstrap'
import { InputField } from './FormItems';
import {isRequired} from './validation'

const roleOptions = [
    {
        value: 'clinician',
        label: 'Clinician'
    },
    {
        value: 'patient',
        label: 'Patient'
    },
    {
        value: 'viewer',
        label: 'Viewer'
    }
]
class AddUser extends Component {
    componentWillMount() {
        this.setState({name: ''})
    }
    onChangeName = (event) => {
        this.setState({name:event.target.value})
    }
    render () {
        const {handleSubmit} = this.props
        return (
            <form onSubmit={ handleSubmit }>
                <Field name="first_name" type="text" component={InputField} label="First Name" placeholder="" validate={isRequired} />
                <Field name="last_name" type="text" component={InputField} label="Last Name" placeholder="" validate={isRequired} />
                <Field name="email" type="email" component={InputField} label="Email" placeholder="" validate={isRequired} />
                <Field name="role" componentClass="select" component={InputField} options={roleOptions} label="Role" placeholder="" validate={isRequired} />
            </form>
        )
    }
}

export default reduxForm({
    // a unique name for the form
    form: 'add-user-form'
})(AddUser)
  