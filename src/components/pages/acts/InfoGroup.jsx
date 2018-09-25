import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { getPath } from '../../../actions/api';

class InfoGroup extends Component {
  static propTypes = {
    onEdit: PropTypes.func,
    onAdd: PropTypes.func,
    group: PropTypes.object,
  }

  state = {

  }

  componentWillMount() {
    const {group:{_id:parentId, name}, getPath} = this.props;
    console.log(this.props);
    console.log("info group:",parentId);
    getPath('folder', {parentId, parentType: 'folder'}).then(acts => {
      let info;
      let consent;
      acts.forEach(act => {
        if(act.meta && act.meta.info) {
          info = act;
        } else if(act.meta && act.meta.consent) {
          consent = act;
        }
      });
      this.setState({info, consent});
    });
  }

  render() {
    const {group, name, onEdit, onAdd} = this.props;
    const {info, consent} = this.state;
    const infoButton = (info ? 
      <Button onClick={() => onEdit(info)}>{info.name}</Button> 
      : <Button onClick={() => onAdd('info')}>&#8853;</Button>);
    const consentButton = (consent ? <Button onClick={() => onEdit(consent)}>{consent.name}</Button> : <Button onClick={() => onAdd("consent")}>&#8853;</Button>);
    return (
      <Grid item xs={12}>
        <Grid item>
          <h4><strong>{name} information screens:</strong> {infoButton}</h4>
        </Grid>
        <Grid item>
          <h4><strong>{name} consent:</strong> {consentButton}</h4>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  getPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoGroup)
