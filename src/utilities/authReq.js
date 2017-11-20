const axios = require('axios')
const MESSAGES = {
  'No token': 'JWT is not available. Please provide authorization token to authenticatedRequest().',
  'Not a string': 'JWT passed was not a string.'
}

export default (token) => {
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
