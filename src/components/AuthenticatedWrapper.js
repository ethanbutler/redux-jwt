import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

class AuthenticatedWrapper extends Component {
  componentWillMount() {
    const {
      auth,
      dispatchCreateUserActions,
      signup
    } = this.props

    dispatchCreateUserActions({
      authEndpoint: auth,
      signupEndpoint: signup
    })
  }

  render() {
    return this.props.children
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatchCreateUserActions: ({ authEndpoint, signupEndpoint }) => ({
    type: "CREATE_USER_ACTIONS",
    authEndpoint,
    signupEndpoint
  })
}, dispatch)

export default connect(
  null,
  mapDispatchToProps
)(AuthenticatedWrapper)
