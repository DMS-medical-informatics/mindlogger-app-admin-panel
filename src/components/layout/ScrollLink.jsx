import React, { Component } from 'react'

export default class ScrollLink extends Component {
  scrollTo(){
    const el = document.querySelector(`#${this.props.to}`)
    if (el)
      el.scrollIntoView()
  }
  render() {
    const {tag, children} = this.props;
    if (tag === 'div') {
      return (
        <div onClick={() => this.scrollTo()}>{children}</div>
      )  
    } else {
      return (
        <li onClick={() => this.scrollTo()}>{children}</li>
      )
    }
  }
}
