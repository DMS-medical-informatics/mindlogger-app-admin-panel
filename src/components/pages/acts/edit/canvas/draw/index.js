import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { destroy } from 'redux-form';
import DrawForm from './DrawForm';



class CanvasDrawForm extends Component {
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
    destroy('canvas-draw-form');
  }
  render() {
    
    return (
      <div className="p-3">
        <DrawForm onSubmit={this.onSubmit} nitialValues={this.props.data} screenId={this.props.screenId}/>
      </div>
    );
  }
}

CanvasDrawForm.propTypes = {
  onSubmit: PropTypes.func,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
  destroy
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasDrawForm);