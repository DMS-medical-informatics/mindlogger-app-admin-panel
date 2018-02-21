import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Route, Redirect } from "react-router-dom"

export const pathsByRole = {
  clinician: ["/users", "/answers"],
  patient: ["/profile"],
  viewer: ["/dashboard", "/users"]
}

class AuthRoute extends React.Component {
  static propTypes = {
    user: PropTypes.object,
  }
  renderByRole = (props) => {
    const { user, component: Component } = this.props
    let role = user.role || 'user'
    let redirectPath
    
    if (role.includes('admin')) {

    } else if (role == 'clinician') {

    } else if (role == 'patient' || role == 'viewer') {
      let paths = pathsByRole[role]
      redirectPath = (paths && paths.some(item => props.location.pathname.startsWith(item))) ? false : '/'
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
  user: state.entities.auth || {},
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
