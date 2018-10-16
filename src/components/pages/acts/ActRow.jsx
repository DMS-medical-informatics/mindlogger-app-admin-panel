import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { withStyles } from '@material-ui/core/styles';

import { getPath, getFoldersDict } from '../../../actions/api';

const StyledButton = withStyles({
  label: {
    textTransform: 'initial',
  },
})(Button);
class ActRow extends Component {
  static propTypes = {
    act: PropTypes.object.isRequired
  }

  componentWillMount() {
    const {getFoldersDict, act} = this.props;
    getFoldersDict('folder', act._id);
  }

  render() {
    const {variants, act, onEdit, onAddInfo, onEditInfo} = this.props;
    let info;
    if(variants) {
      Object.keys(variants).forEach(key => {
        const variant = variants[key];
        if(variant.meta && variant.meta.info) {
          info = variant;
        }
      })
    }
    return (
      <Grid container>
        <Grid item xs={6}><StyledButton onClick={() => onEdit(act)}>{(act.meta && act.meta["schema:name"] && act.meta["schema:name"]["@value"]) ? act.meta["schema:name"]["@value"] : act.name}</StyledButton></Grid>
        <Grid item xs={6}>{info ? <StyledButton onClick={() => onEditInfo(info)}>{(info.meta && info.meta["schema:name"] && info.meta["schema:name"]["@value"]) ? info.meta["schema:name"]["@value"] : info.name}</StyledButton> : <StyledButton onClick={() => onAddInfo(act, 'info')}><AddIcon/></StyledButton>}</Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  variants: state.entities.objects && state.entities.objects[`folder/${ownProps.act._id}`] || {},
})

const mapDispatchToProps = {
  getFoldersDict, getPath
}

export default connect(mapStateToProps, mapDispatchToProps)(ActRow)
