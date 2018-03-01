
import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {formValues, getFormValues, reset, submit} from 'redux-form';
import {withRouter} from 'react-router';
import { Panel, Pagination, Row, Col, FormGroup, Button, ButtonToolbar, Well } from 'react-bootstrap';

import { updateAct, addAct } from '../../../actions/api';
import { prepareAct } from '../../../helpers/index';
import { LinkContainer } from 'react-router-bootstrap';
import SurveyEditQuestion from './SurveyEditQuestion';
import TableSurveyEditQuestion from './TableSurveyEditQuestion';
const surveyInitial = {
  questions:[],
  frequency: '1d',
}

class EditSurvey extends Component {

    constructor(props) {
        super(props);
    }

    updateAct = (act) => {
        const {updateAct, history} = this.props
        updateAct(act).then(res => {
            history.push('/acts')
        }).catch(err => {
            console.log(err)
        })
    }

    componentWillMount() {
        let {acts, actId} = this.props
        if(actId !== undefined) {
            const act = acts.find(obj => obj.id == actId) || this.props.act
            const survey = act.act_data
            this.setState({survey, act, questionIndex:0})
        } else {
            this.setState({})
        }
        this.nextIndex = 0;
    }
    updateQuestion = (body) => {
        let {acts, user, onUpdate} = this.props
        let {questionIndex, act} = this.state
        const questions = act.act_data.questions || []
        if(questions.length>questionIndex) {
            questions[questionIndex] = body
        } else {
            questions.push(body)
        }
        act.questions = questions
        this.setState({act})
        if(this.nextIndex == -1) {
            this.updateAct(act)
        } else {
            this.loadQuestion(this.nextIndex)
        }
    }

    deleteQuestion() {
        let {questionIndex, act} = this.state
        const survey = act.act_data
        let questions = survey.questions || []
        if(questions.length>questionIndex) {
            questions.splice(questionIndex,1)
        }
        survey.questions = questions
        questionIndex = questionIndex - 1
        if(questionIndex<0) questionIndex = 0
        this.setState({act, questionIndex})
        this.props.reset(this.formName())
        //Actions.replace("survey_basic_edit_question",{actIndex, questionIndex})
    }

    formName() {
        return this.state.act.mode == 'basic' ? 'survey-edit-question' : 'survey-table-edit-question'
    }
    updateAndNext = () => {
        this.nextIndex = this.state.questionIndex+1;
        this.props.submit(this.formName())
    }

    updateAndDone = () => {
        this.nextIndex = -1
        this.props.submit(this.formName())
    }

    loadQuestion(questionIndex) {
        this.setState({questionIndex})
        this.props.reset(this.formName())
    }

    selectQuestion = (index) => {
        this.nextIndex = index-1
        this.props.submit(this.formName())
    }

    render() {
        const {survey, questionIndex, act} = this.state;
        const {actIndex, acts, mode} = this.props
        let title = act ? act.title : (survey.mode == 'table' ? "New Table Survey" : "New Survey" )
        const count = survey.questions.length

        return (
            <div>
                <Panel header={title}>
                <Pagination
                prev
                next
                first
                last
                boundaryLinks
                items={count}
                maxButtons={10}
                activePage={questionIndex+1}
                onSelect={this.selectQuestion}/>
                <Well>
                    {survey.mode == 'basic' && <SurveyEditQuestion act={act} questionIndex={questionIndex} onUpdate={this.updateQuestion}/> }
                    {survey.mode == 'table' && <TableSurveyEditQuestion act={act} questionIndex={questionIndex} onUpdate={this.updateQuestion}/> }
                    <ButtonToolbar>
                        <Button onClick={() => this.updateAndNext()}>Next</Button>
                        <Button bsStyle="danger" onClick={() => this.deleteQuestion()}>Delete</Button>
                    </ButtonToolbar>
                </Well>
                <Row>
                    <Col md={12}>
                    
                    <LinkContainer to='/acts'>
                        <Button>Back</Button>
                    </LinkContainer>
                    <Button bsStyle="success" className="pull-right"onClick={()=> this.updateAndDone()}>Done</Button>
                    </Col>
                </Row>
                </Panel>
                
            </div>
        );
    }
}
const mapDispatchToProps = {
  addAct, updateAct, reset, submit
}

const mapStateToProps = (state, ownProps) => ({
  acts: state.entities.acts,
  act: state.entities.act,
  user: state.entities.auth,
  actId: ownProps.match.params.id,
});

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(EditSurvey)