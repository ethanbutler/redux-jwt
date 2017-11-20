import authReq from "./authReq"

import {
  clearUserData,
  saveUserData
} from "./localData"

const axios = require('axios')

export default (
  SIGNUP_ENDPOINT,
  AUTH_ENDPOINT
) => ({
  signup: (accountData) => new Promise((resolve, reject) => {
    axios.post(SIGNUP_ENDPOINT, accountData)
    .then(({data}) => {
      saveUserData(data)
      resolve(data)
    })
    .catch(reject)
  }),
  login: ({email, password}) => new Promise((resolve, reject) => {
    axios.post(AUTH_ENDPOINT, {
      email,
      password
    })
    .then(({data}) => {
      saveUserData(data)
      resolve(data)
    })
    .catch(reject)
  }),
  logout: () => new Promise((resolve, reject) => {
    clearUserData()
    resolve()
  })
})
