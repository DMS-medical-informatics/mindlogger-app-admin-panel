
import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import { reset, submit} from 'redux-form';
import {withRouter} from 'react-router';

import { updateAct, addAct } from '../../actions/api';
//import TableSurveyEditQuestion from './TableSurveyEditQuestion';
import SurveyQuestion from '../modules/survey/SurveyQuestion';

class TakeAct extends Component {

    updateAct = (act) => {
        const {updateAct, history} = this.props
        updateAct(act).then(res => {
            history.push('/acts')
        }).catch(err => {
            console.log(err)
        })
    }

    componentWillMount() {
        this.nextIndex = 0;
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
        return (
            <div>
                <SurveyQuestion />
            </div>
        );
    }
}
const mapDispatchToProps = {
  addAct, updateAct, reset, submit
}

const mapStateToProps = (state, ownProps) => ({
  acts: state.entities.acts,
  user: state.entities.auth,
  actId: ownProps.match.params.id,
});

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(TakeAct)