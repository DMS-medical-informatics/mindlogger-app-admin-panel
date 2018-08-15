import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SurveyListTypeForm from './SurveyListTypeForm';
import SurveyListBasicForm from './SurveyListBasicForm';
import SurveyListOrderForm from './SurveyListOrderForm';

class SurveyListForm extends Component {
  componentWillMount() {
    this.setState({page:1, body: {}});
  }
  nextPage = (body) => {
    console.log(body);
    let {type, page} = this.state;
    page = page + 1;
    this.setState({page, body});
  }
  prevPage = (body) => {
    this.setState({page:this.state.page - 1});
  }
  onSubmit = (body) => {
    console.log(body);
  }
  render() {
    const {onSubmit} = this.props;
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

};

export default SurveyListForm;