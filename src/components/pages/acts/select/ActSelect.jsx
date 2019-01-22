import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import PagedTable from '../../../layout/PagedTable';
import { getPath, getOrganizations } from "../../../../actions/api";
import { setPublicActs } from "../../../../actions/core";
import ProgressCircle from '../../../layout/ProgressCircle';

const actContain = (act, keyword) =>
{
  return act.name.toLowerCase().includes(keyword) || act.volumeName.toLowerCase().includes(keyword);
}
class ActSelect extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  }
  state = {
    results: [],
  }
  componentWillMount() {
    const {volumes, getPath, setPublicActs} = this.props;
    let results = [];
    this.setState({loading: true});
    let tasks = volumes.filter(v => v.public === true)
      .map(volume => (
        // Get Act Groups from volume
        getPath('/folder', {parentId: volume._id, parentType: 'folder'})
        .then(groups => {
          // Get Acts from each group
          return Promise.all(groups.map(
            group => getPath('/folder', {parentId: group._id, parentType:'folder'}).then(acts => {
              // Add additional info to act and merge to final results
              acts = acts.map(act => ({volumeName: volume.name, ...act}));
              results = results.concat(acts);
            })
          ))
        })
      ));
    Promise.all(tasks).then(result => {
      console.log(results);
      setPublicActs(results);
      this.setState({loading: false});
    });
  }

  onSearch = (e) => {
    let keyword = e.target.value.toLowerCase();
    this.setState({keyword});
  }

  renderHeader(text) {
    return (<TableRow>
        <TableCell>
        <h4><strong>{text}</strong></h4>
        </TableCell>
      <TableCell>
        <h4><strong>Activity Set</strong></h4>
      </TableCell>
      <TableCell>
        <h4><strong>Organization</strong></h4>
      </TableCell>
      <TableCell>
        <h4><strong>Category</strong></h4>
      </TableCell>
      <TableCell>
        <h4><strong>Preview</strong></h4>
      </TableCell>
    </TableRow>)
  }
  renderAct = (act) => {
    return (<TableRow key={act._id} hover
          onClick={()=>this.props.onSelect(act)} >
          <TableCell>
            <div style={{'textAlign':'left', 'textTransform': 'capitalize', 'justifyContent': 'left'}}>{ act.name }</div>
          </TableCell>
          <TableCell>
            { act.volumeName }
          </TableCell>
          <TableCell>
            { act.groups && act.groups.map((group, i)=> group.name + (i+1 < act.groups.length ? ", " : "")) }
          </TableCell>
          <TableCell style={act.category ? null : {fontStyle: 'italic'} }>
            { act.category ? act.category : "unknown" }
          </TableCell>
          <TableCell>
            <Button>&#128065;</Button>
          </TableCell>
        </TableRow>)
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
    const {acts, multiselect} = this.props;
    const {loading} = this.state;
    let data = this.filterActs(acts);
    return (
      <div>
      <Grid item>
        <p>Search for Activities in the Mindlogger Library.</p>
      </Grid>
      <Grid item>
      <p>(1) Type keywords in the search box below.</p>
      </Grid>
      <Grid item>
      <p>(2) Select one Activity or an Activity Set to explore further.</p>
      </Grid>
      <Grid container spacing={8} justify="space-between">
        <Grid item xs={3}>
          <TextField className="searchText" onChange={this.onSearch}></TextField>
        </Grid>
      </Grid>
      { loading &&
        <ProgressCircle />
      }
      <PagedTable data={data} header={this.renderHeader(acts ? acts.length + " Activities:" : "")}
          row={this.renderAct}
          />
      {multiselect ? <div style={{"position":"fixed","bottom":"5px"}}>
      <Button variant="contained" color="primary">
        Submit
      </Button>
      </div> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  volumes: state.entities.folder && state.entities.folder.volumes,
  acts: state.entities.publicActs || [],
})

const mapDispatchToProps = {
  getPath,
  getOrganizations,
  setPublicActs
};


export default connect(mapStateToProps, mapDispatchToProps)(ActSelect)
