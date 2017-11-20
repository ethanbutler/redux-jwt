import authReq from '../src/utilities/authReq'

const assert = require('chai').assert


describe('authReq', () => {
  it('should throw error if token is not provided', () => {
    assert.throws(() => {
      authReq()
      authReq(undefined)
      authReq(null)
    })
  })

  it('should return an axios instance with proper headers', () => {
    const auth = authReq('token')
    assert(false)
  })
})
