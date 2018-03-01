
import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {formValues, getFormValues, reset} from 'redux-form';
import {withRouter} from 'react-router';
import { Panel, Pagination, Row, Col, FormGroup, Button, ButtonToolbar, Well } from 'react-bootstrap';

import { updateAct, addAct } from '../../../actions/api';
import { prepareAct } from '../../../helpers/index';
import SurveyEditQuestion from './SurveyEditQuestion';
import { LinkContainer } from 'react-router-bootstrap';

const surveyInitial = {
  questions:[],
  frequency: '1d',
}

class EditSurvey extends Component {

    constructor(props) {
        super(props);
    }

    onEditSurvey = (body) => {
        
        let {acts, actId, user, updateAct} = this.props
        const {act} = this.state
        let survey = {...this.state.survey, ...body}
        
        let {title, ...data} = survey
        if(user.role == 'clinician') {
        return prepareAct(data).then( act_data => {
            let params = { act_data, type:'survey', title}
            return updateAct({id: act.id, title, act_data}).then(result => {
            })
        }).catch(err => {
            console.log(err)
        })
        } else {
        }
    }

    componentWillMount() {
        let {acts, actId} = this.props
        if(actId !== undefined) {
            const act = acts.find(obj => obj.id == actId)
            const survey = act.act_data
            this.setState({survey, act, questionIndex:0})
        } else {
            this.setState({})
        }
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
    }
    updateAndNext = () => {
        this.updateQuestion(this.props.values)
        this.setState({questionIndex: this.state.questionIndex+1})
        this.props.reset('survey-edit-question')
    }

    updateAndDone = () => {
        const {values, history} = this.props
        this.updateQuestion(values)
        this.props.updateAct(this.state.act).then(res => {
            history.push('/acts')
        }).catch(err => {
            console.log(err)
        })
    }

    selectQuestion = (index) => {
        this.updateQuestion(this.props.values)
        this.setState({questionIndex: index-1})
        this.props.reset('survey-edit-question')
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
                <SurveyEditQuestion act={act} questionIndex={questionIndex}/>
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
  addAct, updateAct, reset
}

const mapStateToProps = (state, ownProps) => ({
  acts: state.entities.acts,
  user: state.entities.auth,
  actId: ownProps.match.params.id,
  values: getFormValues('survey-edit-question')(state)
});

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(EditSurvey)