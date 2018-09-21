import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';
import { getFolders } from '../../../actions/api';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';
import ActsSelect from './select/index';

class ActGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    parentId: PropTypes.string
  }

  constructor(props) {
    super(props);
    const {group:{_id:parentId, name}, getFolders, acts} = this.props;
    this.state = {};
    let tops = this;
    let actInstructions = [];
    getFolders(parentId, name, 'folder').then((res) => {
      Promise.all(res.map(function(act, i) {
        return getFolders(act._id, act.name, 'folder').then(act_res => {
          return act_res.length ? act_res.sort((a, b) => new Date(b.updated) - new Date(a.updated))[0] : res[i];
        });
      })).then(function(val) {
      let latestActs = acts.map(function(act) {
        val.forEach(function(_act) {
          if(_act.parentId==act._id){
            _act.parentAct = act;
            act = _act;
            return act;
          };
        });
        if (act.meta && act.meta.instructions && act.meta.instructions["@id"]) {
          let instr = act.meta.instructions["@id"].split('/')[1];
          actInstructions.push(instr);
          acts.forEach(function(inner) {
            if ((instr == inner._id) || (instr == inner.parentId)) {
              act.instr = inner;
            } else {
              val.forEach(function(innerVal) {
                if ((instr == innerVal._id) || (instr == innerVal.parentId)) {
                  act.instr = innerVal;
                }
              });
            }
          });
        }
        return act;
      });
      tops.setState({latestActs:latestActs, actInstructions:actInstructions});
      });
    });
  }

  updateResults = (evt) => {
    const { volume } = this.props;
    const { activities, latestActs } = this.state;
    let filter = evt.target.value;
    let filteredResults = filter.length ? latestActs.filter((activity) => {
      return (activity ? activity.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1: false) || (activity && activity.instr ? activity.instr.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1: false);
    }) : latestActs;
    this.setState({'filteredActs': filteredResults});
  }

  render() {
    const {acts, group, onAdd, onEdit, vol} = this.props;
    if (!this.state.latestActs) {
      return false;
    }
    const {latestActs, actInstructions, filteredActs} = this.state;
    const info = (vol.info ? <Button onClick={() => onEdit(vol.info)}>{vol.info.name}</Button> : <Button onClick={() => onAdd(vol, "Volume", "information")}>&#8853;</Button>);
    const consent = (vol.consent ? <Button onClick={() => onEdit(vol.consent)}>{vol.consent.name}</Button> : <Button onClick={() => onAdd(vol, "Volume", "consent")}>&#8853;</Button>);
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
            <h4><strong>{vol.name} {group.name}</strong> <Button onClick={() => onAdd(vol, "Volume", "Activity")}>&#8853;</Button><TextField type="search" className="search-text" placeholder="&#128269;" value={this.state.inputValue} onChange={evt => this.updateResults(evt)}/></h4>
          </Grid>
          <Grid item xs={6}>
            <strong>&#128712; Activity information</strong>
          </Grid>
        </Grid>
        { (filteredActs ? filteredActs : latestActs).map((act, i) => (
          <div key={i}>
            { ((!vol.info || (act._id != vol.info._id && act._id != vol.info.parentId && (!act.parentAct || act.parentAct._id != vol.info._id && act.parentAct._id != vol.info.parentId))) && (!vol.consent || (act._id != vol.consent._id && act._id != vol.consent.parentId  &&  (!act.parentAct || act.parentAct._id != vol.consent._id && act.parentAct._id != vol.consent.parentId))) && (actInstructions.indexOf(act._id) == -1) && (actInstructions.indexOf(act.parentId) == -1)) ?
            <Grid container>
              <Grid item xs={6}><Button onClick={() => onEdit(act)}>{(act.meta && act.meta["schema:name"] && act.meta["schema:name"]["@value"]) ? act.meta["schema:name"]["@value"] : (act.parentAct) ? act.parentAct.name : act.name}</Button></Grid>
              <Grid item xs={6}>{(act.instr) ? <Button onClick={() => onEdit(act.instr)}>{(act.instr.meta && act.instr.meta["schema:name"] && act.instr.meta["schema:name"]["@value"]) ? act.instr.meta["schema:name"]["@value"] : act.instr.parentAct ? act.instr.parentAct.name : act.instr.name}</Button> : <Button onClick={() => onAdd(act, "Activity", "instructions")}>&#8853;</Button>}</Grid>
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
