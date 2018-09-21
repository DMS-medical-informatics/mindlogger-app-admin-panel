import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {fileLink} from '../../helpers'

export class Image extends Component {
  static propTypes = {
    file: PropTypes.object
  }

  render() {
    const {file, auth, ...props} = this.props
    return (
      <img src={fileLink(file, auth.token)} {...props} />
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.entities.auth || { token: '' }
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Image)
