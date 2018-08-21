import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Bookmarks from './Bookmarks';
import Screen from './Screen';
import { getObject } from '../../../../actions/api';

class Screens extends Component {
  static propTypes = {
    screens: PropTypes.array
  }

  state = {
    screens: [],
    screensData: [],
  }

  componentWillMount() {
    this.setState({screens: this.props.screens});
    this.loadScreen(0, this.props.screens);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screens) {
      this.setState({screens: nextProps.screens});
      this.loadScreen(this.state.index || 0, nextProps.screens);
    }
  }
  
  componentWillUnmount() {

  }

  loadScreen(index, screens) {
    let {screensData} = this.state;
    if (!screens) {
      screens = this.state.screens;
    }
    const {getObject} = this.props;
    if (screens && screens[index]) {
      const id = screens[index]['@id'].split("/")[1];
      
      if (screensData[index] === undefined) {
        console.log("loading..", id);
        getObject('item', id).then(res => {
          let screensData = [...this.state.screensData];
          screensData[index] = {name: res.name, ...res.meta};
          this.setState({index, screensData});
        })
      } else {
        this.setState({index});
      }
    }
  }

  selectScreen = (index) => {
    if (this.formRef) {
      let errors = this.formRef.submit();
      if (errors === undefined) {
        this.loadScreen(index);
      } else {
        window.alert("Please fix valdiation errors");
      }
    } else {
      this.loadScreen(index);
    }
  }

  onSaveScreen = (body) => {
    const {index,screensData, screens} = this.state;
    screensData[index] = body;
    this.setState({screensData});
  }
  
  render() {
    const {screensData, index, screens} = this.state;
    const screen = screensData[index];
    return (
      <div className="screens">
        <Bookmarks screens={screens} index={index} onSelect={this.selectScreen} />
        <Screen index={index} screen={screen} onFormRef={ref => (this.formRef = ref)} onSaveScreen={this.onSaveScreen}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  getObject
}

export default connect(mapStateToProps, mapDispatchToProps)(Screens)
