import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import { getFolders } from '../../../actions/api';
import ActRow from './ActRow';

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
    const {group, onAdd, onEdit, name, onEditInfo, onAddInfo} = this.props;
    let acts = this.filterActs();
    return (
      <div>
        <Grid container>
          <Grid item xs={6}>
            <div className="pl-3">
            <TextField className="search-text" placeholder="&#128269; Activity name" onChange={this.onSearch}/>
            </div>
          </Grid>
        </Grid>
        <div className="pt-3">
        <Grid container>
          <Grid item xs={6}>
            <div className="pl-3">
              <strong>{name} {group.name}</strong> <Button onClick={() => onAdd(group)}><AddIcon/></Button>
            </div>
          </Grid>
          <Grid item xs={6} className="pl-3">
            <strong>Activity Information Screens</strong>
          </Grid>
        </Grid>
        </div>
        { acts.map((act, i) => <div key={i}>
            <ActRow key={i} act={act} onEdit={onEdit} onEditInfo={onEditInfo} onAddInfo={onAddInfo}/>
          </div>) }
      </div>
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
