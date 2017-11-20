import React, { Component }   from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

class Logout extends Component {
  handleClick() {
    const {
      userActions,
      dispatchLogout
    } = this.props

    userActions.logout()
    .then(dispatchLogout)
  }

  render() {
    const {
      children,
      dispatchLogout,
      isBlock
    } = this.props
    return (isBlock ?
      <div onClick={this.handleClick.bind(this)}>{children}</div> :
      <span onClick={this.handleClick.bind(this)}>{children}</span>
    )
  }
}

const mapStateToProps = ({userActions}) => ({
  userActions
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatchLogout: () => ({
    type: "LOG_OUT"
  })
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)
