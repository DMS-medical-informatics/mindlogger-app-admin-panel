import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';

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
      : <Button onClick={() => onAdd('info')}><AddIcon /></Button>);
    return (
      <div>
      <p> {info ? "Edit Information Screens, Start Screens, and Activities for the ETA Activity Set, and edit the Information Screens and Start Screens for each Activity. Tap on a [+] to add missing screens or a new Activity." : "Edit Information Screens, Start Screens, and Activities for the ETA Activity Set, and edit the Information Screens for each Activity. Tap on a [+] to add missing screens or a new Activity." }</p>
      <Grid item xs={12}>
        <Grid item>
          <h4><strong>{name} Activity Set Information screens:</strong> {infoButton}</h4>
        </Grid>
      </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  getPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoGroup)
