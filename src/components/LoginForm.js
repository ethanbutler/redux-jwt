import React, { Component } from "react"
import { findDOMNode }      from "react-dom"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import accountActions       from "../utilities/actions"

class LoginForm extends Component {
  fieldRenderer({label, type}) {
    const id = label.toLowerCase().replace("\s", '-')
    return (
      <label htmlFor={id}>
        {label}
        <input id={id} type={type}/>
      </label>
    )
  }

  handleSubmit(e) {
    e.preventDefault()

    const {
      dispatchCreateAuthenticatedRequest,
      userActions,
      dispatchLogin,
      handleError,
      handleSuccess
    } = this.props
    const email    = findDOMNode(this.refs.email).value
    const password = findDOMNode(this.refs.password).value

    userActions.login({email, password})
    .then((data) => {
      dispatchLogin(data)
      if(handleSuccess) handleSuccess(data)
    })
    .catch(handleError || console.log)
  }

  render() {
    const {
      fallback,
      isLoggedIn,
      submitText
    } = this.props

    return (!isLoggedIn ? (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label htmlFor="login-email">
          Email address
          <input ref="email" id="login-email" type="email"/>
        </label>
        <label htmlFor="login-password">
          Password
          <input ref="password" type="login-password" type="password"/>
        </label>
        <input type="submit" value={submitText}></input>
      </form>
    ) : (fallback || null))
  }
}

const mapStateToProps = ({user, userActions}) => ({
  isLoggedIn: user.isLoggedIn,
  userActions
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatchLogin: (data) => ({
    type: "LOG_IN",
    data
  })
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)
