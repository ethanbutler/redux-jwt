import authReq        from "../utilities/authReq"
import accountActions from "../utilities/actions"

export const user = (state = {
  isLoggedIn: false,
  data: {},
  authenticateRequest: null
}, action) => {
  const { type, data } = action
  switch(type){
    case "LOG_IN":
      return Object.assign({}, state, {
        isLoggedIn: true,
        data: data.user,
        authenticateRequest: authReq(data.auth.token)
      })
    case "LOG_OUT":
      return Object.assign({}, state, {
        isLoggedIn: false,
        data: undefined,
        authenticateRequest: null
      })
    default:
      return state
  }
}


export const userActions = (state = null, action) => {
  const { type, signupEndpoint, authEndpoint } = action
  switch(type){
    case "CREATE_USER_ACTIONS":
      return accountActions(signupEndpoint, authEndpoint)
    default:
      return state
  }
}

export default {
  user,
  userActions
}
