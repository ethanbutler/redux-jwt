import React, { Component }   from "react"
import ReactDOM               from "react-dom"
import { Provider, connect }  from "react-redux"

import thunk  from "redux-thunk"
import logger from "redux-logger"

import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  createStore,
  compose
} from "redux"

// TODO make this suck less
import ReduxJWT from "../../dist/redux-jwt.min"

const {
  AuthenticatedWrapper,
  AuthenticatedFallback,
  AuthenticatedView,
  LoginForm,
  Logout,
  SignupForm
} = ReduxJWT.components

const {
  user,
  userActions
} = ReduxJWT.reducers

const { authReq } = ReduxJWT.utilities
const { loadUserData } = ReduxJWT.utilities.localData

class Demo extends Component {
  componentWillMount() {
    this.handleMessage()
  }

  handleMessage() {
    const {
      authenticateRequest,
      dispatchMessage,
      dispatchClearError
    } = this.props

    if(!authenticateRequest) return

    authenticateRequest.get('/api/authenticated-endpoint')
    .then(({data}) => {
      dispatchClearError()
      dispatchMessage(data.message)
    })
    .catch(this.handleError)
  }

  handleError(err) {
    const { dispatchError } = this.props
    dispatchError(err.message || err)
  }

  renderFallback(view) {
    const { dispatchFallbackView } = this.props

    switch(view){
      case 'login':
        return (
          <div>
            <strong>{'Log In'}</strong>
            <br/>
            <LoginForm
              handleSuccess={this.handleMessage.bind(this)}
              handleError={this.handleError.bind(this)}
            />
            <a onClick={() => dispatchFallbackView('signup')}>
              {'I need an account'}
            </a>
          </div>
        )
      case 'signup':
        const fields = [
          { label: "Email", type: "email" },
          { label: "Password", type: "password" },
        ]
        return (
          <div>
            <strong>{'Sign Up'}</strong>
            <br/>
            <SignupForm
              fields={fields}
              handleSuccess={this.handleMessage.bind(this)}
              handleError={this.handleError.bind(this)}
            />
            <a onClick={() => dispatchFallbackView('login')}>
              {'I have an account'}
            </a>
          </div>
        )
      default:
        return null
    }
  }

  // TODO: Add to docs
  render() {
    const { error, message, fallbackView } = this.props
    return (
      <AuthenticatedWrapper
        auth={AUTH_ENDPOINT}
        signup={SIGNUP_ENDPOINT}
      >
        <AuthenticatedView>
          {message}
          <Logout>{"Log me out"}</Logout>
        </AuthenticatedView>
        <AuthenticatedFallback>
          {error}
          {this.renderFallback(fallbackView)}
        </AuthenticatedFallback>
      </AuthenticatedWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn:           state.user.isLoggedIn,
  message:              state.message,
  fallbackView:         state.fallbackView,
  authenticateRequest:  state.user.authenticateRequest,
  error:                state.error
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatchMessage: (message) => dispatch({
    type: "SET_MESSAGE",
    message
  }),
  dispatchFallbackView: (view) => dispatch({
    type: "SET_FALLBACK_VIEW",
    view
  }),
  dispatchError: (error) => dispatch({
    type: "SET_ERROR",
    error
  }),
  dispatchClearError: () => dispatch({
    type: "CLEAR_ERROR"
  })
}, dispatch)

const ConnectedDemo = connect(
  mapStateToProps,
  mapDispatchToProps
)(Demo)

const states = [{
  message: null,
  fallbackView: 'login',
  user: {
    isLoggedIn: false
  }
}]

// TODO: Include in docs
const userData = loadUserData()
const AUTH_ENDPOINT   = '/api/auth'
const SIGNUP_ENDPOINT = '/api/user'
if(userData){
  console.log(userData)
  states.push({
    user: {
      isLoggedIn: true,
      data: userData,
      authenticateRequest: authReq(userData.auth.token)
    }
  })
}

const initialState = Object.assign({}, ...states)

const composedEnhancers = compose(
  applyMiddleware(thunk, logger)
)

const store = createStore(
  combineReducers({
    message: (state = null, action) => {
      switch(action.type){
        case "SET_MESSAGE":
          return action.message
        default:
          return state
      }
    },
    fallbackView: (state = 'login', action) => {
      switch(action.type){
        case "SET_FALLBACK_VIEW":
          return action.view
        default:
          return state
      }
    },
    error: (state = null, action) => {
      switch(action.type){
        case "SET_ERROR":
          return action.error
        case "CLEAR_ERROR":
          return null
        default:
          return state
      }
    },
    // TODO: Include in docs
    user,
    userActions
  }),
  initialState,
  composedEnhancers
)

ReactDOM.render((
  <Provider store={store}>
    <ConnectedDemo />
  </Provider>
), document.getElementById('root'))
