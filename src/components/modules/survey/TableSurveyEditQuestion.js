
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Glyphicon, Image} from 'react-bootstrap';
import {reduxForm, Field, formValueSelector, FieldArray, submit, reset} from 'redux-form';
import { isRequired } from '../../../helpers/index';
import { InputField, InputFieldWithButton } from '../../forms/FormItems';


class SurveyTableEditQuestionForm extends Component {

    constructor(props) {
      super(props)
    }
    componentWillMount() {
        this.setState({})
    }
    renderRows = ({fields, label, count, meta: {error, submitFailed}}) => {
        return (<div>
            <Row>
            {fields.map((member,index) => (
              <Col md={3} key={index}><Field label={`Choice ${index+1}`} name={`${member}.text`} type="text" component={InputField}/></Col>
            ))}
            </Row>
            
          </div>)
    }

    renderImageComponent = ({input}) => {
        return (<Button transparent onPress={() => this.showImageBrowser(input) }>{input.value ? <Image src={{uri: input.value}} /> : <Glyphicon name="image" />}</Button>)
    }

    renderImageRows = ({fields,label, count, meta: {error, submitFailed}}) => {
        return (<div>
            {fields.map((item,index) => (
                <Row key={index} noBorder>
                    <Col md={8}>
                        <Field key={index} inlineLabel label={`${label} ${index+1}`} name={`${item}.text`} type="text" component={InputField}/>
                    </Col>
                    <Col md={4}>
                        <Field name={`${item}.image_url`} type="text" component={this.renderImageComponent} />
                    </Col>
                </Row>
            ))}
          </div>)
    }

    showImageBrowser(input) {
        this.imageInput = input
        this.setState({imageSelect:true})
    }

    onSelectImage = (item, imagePath) => {
        if(item) {
             this.imageInput.onChange(item.image_url)
        }
        this.setState({imagePath, imageSelect:false})
        
    }

    render() {
        const { handleSubmit, onSubmit, submitting, reset, initialValues } = this.props;
        let {rows, cols, type} = this.props
        let question_type = this.props.question_type || (initialValues && initialValues.type)
        return (
            <form>
                <Field name="title" type="text" placeholder="Add a question" validate={isRequired} component={InputField} />
                <Row>
                    <Col md={4}><Field name="rows_count" type="number" label="Number of rows" min={1} component={InputField} /></Col>
                    <Col md={4}><Field name="cols_count" type="number" label="Number of cols" min={1} component={InputField} /></Col>
                </Row>
                <FieldArray name="rows" label="Row" count={this.props.rows_count} component={this.renderRows} value={rows}/>
                <Field name="type"
                label="For Columns"
                componentClass="select"
                component ={InputFieldWithButton}
                placeholder = "Response type"
                options   ={[
                    {label:"Response Type", value:undefined},
                    {label:"Text value",value:"text"},
                    {label:"Number #",value:"number"},
                    {label:"Single selection",value:"single_sel"},
                    {label:"Multiple selection",value:"multi_sel"},
                    {label:"Image selection", value: "image_sel"},
                ]} validate={isRequired}/>
                <FieldArray name="cols" label="Col" count={this.props.cols_count} component={ type == 'image_sel' ? this.renderImageRows : this.renderRows} value={cols}/>
                {/* { this.state.imageSelect && <ImageBrowser path={this.state.imagePath} onSelectImage={this.onSelectImage}/> } */}
            </form>)
    }
}

const SurveyTableEditQuestionReduxForm = reduxForm({
  form: 'survey-table-edit-question',
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(SurveyTableEditQuestionForm)
const expandFields = (fields, count) => {
    if(fields.length>count) {
        for(var i=0;i<fields.length-count;i++)
        {
            fields.pop()
        }
    } else if(fields.length<count) {
        for(var i=0;i<count-fields.length;i++)
        {
            fields.push({})
        }
    }
    return fields
}
const selector = formValueSelector('survey-table-edit-question')
const SurveyTableEditQuestionValueForm = connect(
  state => {
    let {rows_count, cols_count, rows, cols, type} = selector(state, 'rows_count', 'cols_count', 'rows', 'cols', 'type')
    rows = rows || []
    rows = expandFields(rows, rows_count)
    cols = cols || []
    cols = expandFields(cols, cols_count)
    return {rows_count, cols_count, rows, cols, type}
  }
)(SurveyTableEditQuestionReduxForm)

class SurveyTableEditQuestion extends Component {

    constructor(props) {
        super(props);
        this.state = {
        mode: 1,
        };
    }
    componentWillMount() {
        this.setState({})
    }

    render() {
        let {questionIndex, act, onUpdate} = this.props
        const survey = act.act_data
        let question = {
            title: "",
            rows_count: 1,
            cols_count: 1,
            rows: [{text:''}],
            cols: [{text:''}],
          }
        survey.questions = survey.questions || []
        if(questionIndex<survey.questions.length) {
            question = survey.questions[questionIndex]
        } else if(questionIndex>0) {
            question = {...question, ...survey.questions[questionIndex-1], title: ''}
        }
        return (
        <div>
            <h3>Question {questionIndex+1}</h3>
            <SurveyTableEditQuestionValueForm onSubmit={onUpdate} initialValues={question}/>
        </div>
        );
    }
} 

const mapDispatchToProps = (dispatch) => ({
  
})

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyTableEditQuestion);
