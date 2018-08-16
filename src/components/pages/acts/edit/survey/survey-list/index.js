import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { destroy } from 'redux-form';

import SurveyListTypeForm from './SurveyListTypeForm';
import SurveyListBasicForm from './SurveyListBasicForm';
import SurveyListOrderForm from './SurveyListOrderForm';

class SurveyListForm extends Component {
  componentWillMount() {
    this.setState({page:1, body: {}});
  }
  nextPage = (body) => {
    console.log(body);
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
    destroy('survey-list-form');
  }
  render() {
    const {body, page} = this.state;
    const { mode } = body;
    
    return (
      <div className="p-3">
        {page === 1 && <SurveyListTypeForm onSubmit={this.nextPage}/>}
        {page === 2 && mode === 'single' && <SurveyListBasicForm body={body} previousPage={this.prevPage} onSubmit={this.onSubmit}/>}
        {page === 2 && mode === 'order' && <SurveyListOrderForm body={body} previousPage={this.prevPage} onSubmit={this.onSubmit}/>}
      </div>
    );
  }
}

SurveyListForm.propTypes = {
  onSubmit: PropTypes.func,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
  destroy
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyListForm);