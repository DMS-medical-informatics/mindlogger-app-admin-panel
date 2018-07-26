import React,{Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField } from './FormItems';
import {isRequired} from './validation';

const frequencyOptions = [
    {label:""},
    {label:"3x/day",value:"8h"},
    {label:"2x/day",value:"12h"},
    {label:"daily",value:"1d"},
    {label:"weekly",value:"1w"},
    {label:"monthly",value:"1m"},
    {label:"one time",value:"1"},
];

const accordionOptions = [
    {label:"No", value: false},
    {label:"Yes", value: true}
];

const modeOptions = [
    {label:'Basic', value: 'basic'},
    {label:'Table', value: 'table'}
];
class SurveyForm extends Component {
    componentWillMount() {
        this.setState({name: ''});
    }
    onChangeName = (event) => {
        this.setState({name:event.target.value});
    }
    render () {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={ handleSubmit }>
                <Field name="title" type="text" label="Title" validate={isRequired} component={InputField} />
                <Field name="instruction" type="text" label="Instruction" placeholder='' component={InputField} />
                {/* <Field name="audio_path" type="text" stackedLabel label="Audio instruction" component={FormInputAudio} /> */}
                <Field name="mode" label="Mode" componentClass="select" component={InputField} options={modeOptions}/>
                <Field name="accordion" label="Accordion style survey?" parse={value => value === "true"} componentClass="select" component={InputField} options={accordionOptions}/>
                <Field name="frequency" componentClass="select" component={InputField} options={frequencyOptions} label="Frequency" placeholder="" validate={isRequired} />
            </form>
        )
    }
}

export default reduxForm({
    // a unique name for the form
    form: 'add-survey-form'
})(SurveyForm);
  