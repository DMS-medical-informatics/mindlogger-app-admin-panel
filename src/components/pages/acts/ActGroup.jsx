import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import { getFolders } from '../../../actions/api';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const actContain = (act, keyword) => 
{
  return act.name.toLowerCase().includes(keyword)
}

class ActGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    parentId: PropTypes.string
  }

  state = {}
  componentWillMount() {
    const {group:{_id:parentId, name}, getFolders} = this.props;
    getFolders(parentId, name, 'folder');
  }

  onSearch = (e) => {
    let keyword = e.target.value.toLowerCase();
    this.setState({keyword});
  }

  filterActs() {
    const {keyword} = this.state;
    const {acts} = this.props;
    if (keyword && keyword.length>0) {
      return acts.filter(act =>  actContain(act, keyword))
    } else {
      return acts;
    }
  }
  render() {
    const {group, onAdd, onEdit, name} = this.props;
    let acts = this.filterActs();
    return (
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={6}>
            <strong>{name} {group.name}</strong> <Button onClick={onAdd}>&#8853;</Button>
            <TextField className="search-text" placeholder="&#128269;" onChange={this.onSearch}/>
          </Grid>
          <Grid item xs={6}>
            <strong>&#128712; Activity information</strong>
          </Grid>
        </Grid>
        { acts.map((act, i) => <div key={i}>
            <Grid container>
              <Grid item xs={6}><Button onClick={() => onEdit(act)}>{(act.meta && act.meta["schema:name"] && act.meta["schema:name"]["@value"]) ? act.meta["schema:name"]["@value"] : act.name}</Button></Grid>
              <Grid item xs={6}>{(act.instr) ? <Button onClick={() => onEdit(act.instr)}>{(act.instr.meta && act.instr.meta["schema:name"] && act.instr.meta["schema:name"]["@value"]) ? act.instr.meta["schema:name"]["@value"] : act.instr.parentAct ? act.instr.parentAct.name : act.instr.name}</Button> : <Button onClick={() => onAdd(act, "Activity", "instructions")}>&#8853;</Button>}</Grid>
            </Grid>
          </div>) }
        
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
