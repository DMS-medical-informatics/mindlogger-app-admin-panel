import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, FieldArray, formValueSelector, submit } from 'redux-form'
import { FormGroup, FormControl, Button, Row, Col, Glyphicon, Image } from 'react-bootstrap'

import { InputField, InputFieldWithButton } from '../../forms/FormItems';
import { isRequired } from '../../forms/validation';
import ImageBrowser from '../../forms/ImageBrowser';
import '../../forms/form.css';
import ImageField from '../../forms/ImageField';

class SurveyEditQuestionForm extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.setState({ imageSelect: false})
    }

    renderRows = ({ fields, meta: { error, submitFailed } }) => {
        return (<div>
            {fields.map((member, index) => (
                <Row key={index}>
                    <Col xs={4}>
                        <Field placeholder={`Choice ${index + 1}`} name={`${member}.text`} type="text" component={InputField} />
                    </Col>
                    <Col xs={4}>
                        <Field placeholder={`Score`} name={`${member}.value`} type="number" parse={value => value ? Number(value) : 0} component={InputField} />
                    </Col>
                    <Col xs={4}>
                        <Button onClick={() => fields.remove(index)} bsStyle="danger"><Glyphicon glyph={'trash'} /></Button>
                    </Col>
                </Row>

            ))}

            <Button onClick={() => fields.push({ text: '', value: fields.length })}>Add choice</Button>

        </div>)
    }

    renderImageRows = ({ fields, meta: { error, submitFailed } }) => {
        let images = fields.getAll() || []
        return (<div>
            {images.map((item, index) => (
                <Row key={index}>
                    <Col md={3}>
                        <Image thumbnail src={{ uri: item.image_url }} />
                    </Col>
                    <Col md={6}>
                        {item.name}
                    </Col>
                    <Col md={3}>
                        <Button transparent onClick={() => fields.remove(index)}><Glyphicon glyph="trash" /></Button>
                    </Col>
                </Row>
            ))}
            <Button onClick={() => this.showImageBrowser(fields)}>Add choice</Button>
        </div>)
    }

    renderExtraFields(question_type) {
        switch (question_type) {
            case 'single_sel':
            case 'multi_sel':
                return (<FieldArray name="rows" component={this.renderRows} />)
            case 'image_sel':
            case 'image_sort':
                return (<FieldArray name="images" component={this.renderImageRows} value={this.state.images || []} />)
            case 'drawing':
                return (<Field name="image_url" label="Image" component={ImageField} />)
            default:
                return false
        }
    }

    showImageBrowser(fields) {
        this.imageFields = fields
        this.setState({ imageSelect: true })
    }

    onSelectImage = (item, imagePath) => {
        if (item) {
            this.imageFields.push(item)
        }
        this.setState({ imagePath, imageSelect: false })

    }


    render() {
        const { handleSubmit, onSubmit, submitting, reset, questions, condition_question_index } = this.props;
        let question_type = this.props.question_type || (this.props.initialValues && this.props.initialValues.type)
        let condition_rows
        if (condition_question_index > -1) {
            let question = questions[condition_question_index]
            switch (question.type) {
                case 'single_sel':
                case 'multi_sel':
                    condition_rows = question.rows
                    break;
                case 'image_sel':
                    condition_rows = question.images
                    break;
                default:
                    break
            }
        }

        return (
            <form>
                <Field name="title" type="text" validate={isRequired} placeholder="Add a question" component={InputField} />
                <Field name="type"
                    component={InputField}
                    componentClass="select"
                    placeholder="Question Type"
                    options={[
                        { label: "Text", value: "text" },
                        { label: "Choice", value: "single_sel" },
                        { label: "Multiple", value: "multi_sel" },
                        { label: "Image", value: "image_sel" },
                        { label: "Drawing", value: "drawing" },
                        { label: "Audio", value: "audio" },
                        { label: "Camera", value: "camera" },
                        { label: "Sort Image", value: "image_sort" },
                        { label: "Accelorometer", value: "acc" },
                    ]} validate={isRequired} />
                {this.renderExtraFields(question_type)}
                {this.state.imageSelect && <ImageBrowser path={this.state.imagePath} onSelectImage={this.onSelectImage} />}
                <Row>
                    <Col xs={4}>Conditional Question</Col>
                    <Col xs={4}>
                        <Field
                            name="condition_question_index"
                            component={InputField}
                            parse={value => value && Number(value)}
                            componentClass="select"
                            placeholder="Condition"
                            options={[
                                { label: "None", value: -1 },
                                ...questions.map((q, idx) => ({ label: q.title, value: idx }))
                            ]} />
                    </Col>
                    <Col xs={4}>
                        {condition_rows &&
                            <Field
                                name="condition_choice"
                                component={InputField}
                                parse={value => Number(value)}
                                componentClass="select"
                                placeholder="Condition"
                                options={condition_rows.map((q, idx) => ({ label: q.text, value: idx }))} />
                        }
                    </Col>

                </Row>
            </form>)
    }
}

const SurveyEditQuestionReduxForm = reduxForm({
    form: 'survey-edit-question',
    enableReinitialize: true,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(SurveyEditQuestionForm)

const selector = formValueSelector('survey-edit-question')
const SurveyEditQuestionValueForm = connect(
    state => {
        let { type, images, condition_question_index } = selector(state, 'type', 'images', 'condition_question_index')
        return { question_type: type, images, condition_question_index }
    }
)(SurveyEditQuestionReduxForm)

class SurveyBasicEditQuestion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: 1,
        };
    }

    componentWillMount() {
        let { act } = this.props
        this.setState({ act })
    }

    render() {
        let { questionIndex, act, onUpdate } = this.props
        const survey = act.act_data
        let question = {
            type: "text",
            rows: [],
            images: []
        }
        survey.questions = survey.questions || []
        if (questionIndex < survey.questions.length) {
            question = survey.questions[questionIndex]
        } else if (questionIndex > 0) {
            question = { ...question, ...survey.questions[questionIndex - 1], title: '' }
        }
        console.log(survey)
        return (
            <div>
                <h3>{`Question ${questionIndex + 1}`}</h3>
                <SurveyEditQuestionValueForm onSubmit={onUpdate} initialValues={question} questions={survey.questions} />

            </div>
        );
    }
}

const mapDispatchToProps = {
    submit
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyBasicEditQuestion)