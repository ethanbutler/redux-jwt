import React, { Component }   from "react"
import { findDOMNode }        from "react-dom"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import accountActions         from "../utilities/actions"

class SignupForm extends Component {
  sanitizeFieldId(id) {
    return id.toLowerCase().replace(/\s/, '-')
  }

  fieldRenderer({label, type}) {
    const id = this.sanitizeFieldId(label)
    return (
      <label key={id} htmlFor={id}>
        {label}
        <input ref={id} id={id} type={type}/>
      </label>
    )
  }

  handleSubmit(e) {
    e.preventDefault()

    const {
      dispatchLogin,
      userActions,
      fields,
      handleError,
      handleSuccess
    } = this.props

    const data = fields.reduce((data, field) => {
      const { label } = field
      const id = this.sanitizeFieldId(label)

      return Object.assign({}, data, {
        [id]: findDOMNode(this.refs[id]).value
      })
    }, {})

    userActions.signup(data)
    .then((data) => {
      dispatchLogin(data)
      if(handleSuccess) handleSuccess(data)
    })
    .catch(handleError || console.log)
  }

  render() {
    const {
      fields,
      fieldRenderer,
      isLoggedIn,
      submitText
    } = this.props

    return (!isLoggedIn ? (
      <form onSubmit={this.handleSubmit.bind(this)}>
        {fields.map(fieldRenderer ? fieldRenderer : this.fieldRenderer.bind(this))}
        <input type="submit" value={submitText} />
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
)(SignupForm)
