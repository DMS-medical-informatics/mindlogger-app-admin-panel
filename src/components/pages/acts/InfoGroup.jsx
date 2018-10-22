import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import { getPath } from '../../../actions/api';
import LButton from '../../controls/LButton';

class InfoGroup extends Component {
  static propTypes = {
    onEdit: PropTypes.func,
    onAdd: PropTypes.func,
    group: PropTypes.object,
  }

  state = {

  }

  componentWillMount() {
    const {group:{_id:parentId}, getPath} = this.props;
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
    const { name, onEdit, onAdd} = this.props;
    const {info} = this.state;
    const infoButton = (info ? 
      <LButton onClick={() => onEdit(info, true)}>{info.name}</LButton>
      : <Button onClick={() => onAdd('info')}><AddIcon /></Button>);
    return (
      <div>
      <Grid container>
        <Grid item>
          <p> Here you can {info ? 'edit' : 'add'} the {name} Activity Set’s Information screens, and edit individual Activities and their Information screens.  Tap on a <AddIcon /> to add an Activity or Information screens. </p>
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
