import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import { getFolders, getObject } from '../../../actions/api';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';

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
    const {acts, group, onAdd, onEdit, vol} = this.props;
    const info = (vol.meta.information["@id"] ? <Button onClick={() => onAdd(group)}>{vol.meta.information["@id"]}</Button> : <Button onClick={() => onAdd(group)}>[+]</Button>);
    const consent = (vol.meta.consent["@id"] ? <Button onClick={() => onAdd(group)}>{vol.meta.consent["@id"]}</Button> : <Button onClick={() => onAdd(group)}>[+]</Button>);
    return (
      <Grid item>
        <h4><strong>{vol.name} information screens:</strong> {info}</h4>
        <h4><strong>{vol.name} consent:</strong> {consent}</h4>
        <h4><strong>{vol.name} {group.name}</strong> <Button onClick={() => onAdd(group)}>[+]</Button><TextField type="search" className="search-text"/>&#128269;</h4>
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
