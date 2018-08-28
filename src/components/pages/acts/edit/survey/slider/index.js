import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { destroy } from 'redux-form';

import SurveySliderFirstForm from './SurveySliderFirstForm';
import SurveySliderSecondForm from './SurveySliderSecondForm';

class SurveySliderForm extends Component {
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
    return (
      <div className="p-3">
        {page === 1 && <SurveySliderFirstForm onSubmit={this.nextPage} initialValues={this.props.data}/>}
        {page === 2  && <SurveySliderSecondForm body={body} previousPage={this.prevPage} onSubmit={this.onSubmit}/>}
      </div>
    );
  }
}

SurveySliderForm.propTypes = {
  onSubmit: PropTypes.func,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
  destroy
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveySliderForm);