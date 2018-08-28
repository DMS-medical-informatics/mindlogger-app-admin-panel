import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { destroy } from 'redux-form';
import SurveyDrawForm from './SurveyDrawForm';



class SurveyCanvasDrawForm extends Component {
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
    destroy('survey-draw-form');
  }
  render() {
    
    return (
      <div className="p-3">
        <SurveyDrawForm onSubmit={this.onSubmit} initialValues={this.props.data}/>
      </div>
    );
  }
}

SurveyCanvasDrawForm.propTypes = {
  onSubmit: PropTypes.func,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
  destroy
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyCanvasDrawForm);