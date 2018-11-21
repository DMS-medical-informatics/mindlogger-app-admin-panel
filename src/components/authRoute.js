import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Route, Redirect } from "react-router-dom"


class AuthRoute extends React.Component {
  static propTypes = {
    user: PropTypes.object,
  }
  renderByRole = (props) => {
    const { auth, user, component: Component } = this.props
    let role = user.role || 'user'
    let redirectPath
    if (user.admin) {

    } else if (role === 'user' || role === 'viewer') {

    } else if (user) {
      redirectPath = '/library'

    } else {
      redirectPath = '/login'
    }
    console.log(role, redirectPath)
    return redirectPath ? <Redirect to={{
      pathname: redirectPath,
      state: { from: props.location }
    }}/> : <Component {...props}/>
  }
  render() {
    const { user, component: Component, ...rest } = this.props
    return (
      <Route {...rest} render={this.renderByRole}/>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.entities.auth || {},
  user: state.entities.self || {},
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
