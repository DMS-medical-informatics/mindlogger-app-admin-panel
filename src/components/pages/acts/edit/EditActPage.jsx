import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import EditAct from "./EditAct"

class EditActPage extends Component {

  render() {
    return (
      <EditAct actId={this.props.actId}/>
    );
  }
}
const mapDispatchToProps = {
};

const mapStateToProps = (state, ownProps) => ({
  actId: ownProps.match.params.id,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(EditActPage);
