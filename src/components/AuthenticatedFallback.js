import React, { Component } from "react"
import { connect } from "react-redux"

class AuthenticatedFallback extends Component {
  render() {
    const { children, isLoggedIn } = this.props
    return (!isLoggedIn ? (
      <div>{children}</div>
    ) : null)
  }
}

const mapStateToProps = ({user}) => ({
  isLoggedIn: user.isLoggedIn
})

export default connect(
  mapStateToProps
)(AuthenticatedFallback)
