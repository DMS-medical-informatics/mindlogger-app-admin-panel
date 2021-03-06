import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { destroy } from 'redux-form';

import SurveyTableTypeForm from './SurveyTableTypeForm';
import SurveyTableBasicForm from './SurveyTableBasicForm';
import SurveyTableSelectForm from './SurveyTableSelectForm';
import SurveyTableSelectCellForm from './SurveyTableSelectCellForm';
import SurveyTableOrderForm from './SurveyTableOrderForm';

class SurveyTableForm extends Component {
  componentWillMount() {
    this.setState({page:1, body: {}});
  }
  nextPage = (body) => {
    let {page} = this.state;
    page = page + 1;
    this.setState({page, body});
  }
  prevPage = (body) => {
    this.setState({page:this.state.page - 1});
  }
  onSubmit = (body) => {
    const {onSubmit, destroy} = this.props;
    onSubmit(body);
    destroy('survey-table-form');
  }
  render() {
    const {body, page} = this.state;
    const { mode, selectType } = body;
    const {screenId} = this.props;

    return (
      <div className="p-3">
        {page === 1 && <SurveyTableTypeForm onSubmit={this.nextPage} initialValues={this.props.data} screenId={screenId}/>}
        {page === 2 && (mode === 'text' || mode === 'number') && <SurveyTableBasicForm body={body} previousPage={this.prevPage} onSubmit={this.onSubmit} screenId={screenId}/>}
        {page === 2 && mode === 'select' && <SurveyTableSelectForm body={body} previousPage={this.prevPage} onSubmit={this.nextPage} screenId={screenId}/>}
        {page === 3 && mode === 'select' && selectType === 'basic' && <SurveyTableSelectCellForm body={body} previousPage={this.prevPage} onSubmit={this.onSubmit} screenId={screenId}/>}
        {page === 3 && mode === 'select' && selectType === 'order' && <SurveyTableOrderForm body={body} previousPage={this.prevPage} onSubmit={this.onSubmit} screenId={screenId}/>}
      </div>
    );
  }
}

SurveyTableForm.propTypes = {
  onSubmit: PropTypes.func,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
  destroy
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyTableForm);