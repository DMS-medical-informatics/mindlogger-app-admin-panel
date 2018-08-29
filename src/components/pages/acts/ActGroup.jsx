import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import { getFolders } from '../../../actions/api';
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
    const info = (vol.info ? <Button onClick={() => onEdit(vol.info)}>{vol.info.name}</Button> : <Button onClick={() => onAdd(group)}>[+]</Button>);
    const consent = (vol.consent ? <Button onClick={() => onEdit(vol.consent)}>{vol.consent.name}</Button> : <Button onClick={() => onAdd(group)}>[+]</Button>);
    return (
      <Grid item xs={12}>
        <Grid item>
          <h4><strong>{vol.name} information screens:</strong> {info}</h4>
        </Grid>
        <Grid item>
          <h4><strong>{vol.name} consent:</strong> {consent}</h4>
        </Grid>
        <Grid container>
          <Grid item xs={6}>
            <h4><strong>{vol.name} {group.name}</strong> <Button onClick={() => onAdd(group)}>[+]</Button><TextField type="search" className="search-text"/>&#128269;</h4>
          </Grid>
          <Grid item xs={6}>
            <strong>&#128712; Activity information</strong>
          </Grid>
        </Grid>
        { acts.map((act, i) => (
          <div key={i}>
            { ((!vol.info || (act._id != vol.info._id && act._id != vol.info.parentId)) && (!vol.consent || (act._id != vol.consent._id && act._id != vol.consent.parentId))) ?
            <Grid container>
              <Grid item xs={6}><Button onClick={() => onEdit(act)}>{act.name}</Button></Grid>
              <Grid item xs={6}><Button onClick={() => onAdd(group)}>[{(act.meta && act.meta.instructions && act.meta.instructions["@id"]) ? <Button onClick={() => onAdd(group)}>{act.meta.instructions["@id"]}</Button> : '+'}]</Button></Grid>
            </Grid>
            : null }
          </div>
        )) }
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
