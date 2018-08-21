import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import { getFolders } from '../../../actions/api';
import Button from '@material-ui/core/Button';

class ActGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    parentId: PropTypes.string
  }
  componentWillMount() {
    const {group:{_id:parentId, name}, getFolders} = this.props;
    getFolders(parentId, name, 'folder');
  }
  render() {
    const {acts, group, onAdd, onEdit} = this.props;
    return (
      <Grid item>
        <h3>{group.name}<Button onClick={() => onAdd(group)}>[+]</Button></h3>
        { acts.map((act, i) => <div key={i}><Button onClick={() => onEdit(act)}>{act.name}</Button></div>) }
        
      </Grid>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  acts: state.entities.folder[ownProps.group.name] || []
})

const mapDispatchToProps = {
  getFolders
}

export default connect(mapStateToProps, mapDispatchToProps)(ActGroup)
