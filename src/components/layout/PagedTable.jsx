import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';

import TablePagination from '@material-ui/core/TablePagination';


export default class PagedTable extends Component {
  static propTypes = {
    header: PropTypes.element.isRequired,
    row: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
  }
  state = {
    order: 'asc',
    orderBy: 'calories',
    page: 0,
    rowsPerPage: 10,
  }

  componentWillMount() {
    const {rowsPerPage} = this.props;
    if (rowsPerPage)
      this.setState({rowsPerPage});
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const {header, row, data, className} = this.props;
    const { rowsPerPage, page } = this.state;
    return (
      <div className={className}>
        <Table>
          <TableHead>
            {header}
          </TableHead>
          <TableBody>
            {data.slice(page*rowsPerPage, (page+1)*rowsPerPage).map(k => row(k))}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="rows"
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    )
  }
}
