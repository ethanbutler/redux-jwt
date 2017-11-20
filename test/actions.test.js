import accountActions from "../src/utilities/actions"
import moxios from "moxios"
const assert = require('chai').assert

describe('accountActions', () => {
  const SIGNUP_ENDPOINT = '/api/user'
  const AUTH_ENDPOINT = '/api/auth'
  const LOCAL_STORAGE_ALIAS = 'userData'

  const dummyData = {
    email: 'test@test.dev',
    password: 'password'
  }

  const actions = accountActions(
    SIGNUP_ENDPOINT,
    AUTH_ENDPOINT
  )

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('should submit correctly formatted post request upon signup', (done) => {
    actions.signup(dummyData)
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      const { config } = request
      const { url, data } = config
      assert.equal(url, SIGNUP_ENDPOINT)
      assert.deepEqual(JSON.parse(data), dummyData)
      done()
    })
  })

  it('should store user data upon signup', (done) => {
    actions.signup(dummyData)
    moxios.wait(() => {
      const request  = moxios.requests.mostRecent()
      const response = {
        user: {
          email: dummyData.email
        },
        auth: {
          token: 'token',
          userId: 1
        }
      }

      request.respondWith({
        status: 200,
        response
      })
      .then(() => {
        const userData = localStorage.getItem(LOCAL_STORAGE_ALIAS)
        assert.deepEqual(response, JSON.parse(userData))
        done()
      })
      .catch(done)
    })
  })

  it('should submit correctly formatted post request upon login', (done) => {
    actions.login(dummyData)
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      const { config } = request
      const { url, data } = config
      assert.equal(url, AUTH_ENDPOINT)
      assert.deepEqual(JSON.parse(data), dummyData)
      done()
    })
  })

  it('should store user data upon login', (done) => {
    actions.login(dummyData)
    moxios.wait(() => {
      const request  = moxios.requests.mostRecent()
      const response = {
        auth: {
          token: 'token',
          userId: 1
        }
      }

      request.respondWith({
        status: 200,
        response
      })
      .then(() => {
        const userData = localStorage.getItem(LOCAL_STORAGE_ALIAS)
        assert.deepEqual(response, JSON.parse(userData))
        done()
      })
      .catch(done)
    })
  })

  it('should remove user data upon logout', (done) => {
    localStorage.setItem(LOCAL_STORAGE_ALIAS, dummyData)
    actions.logout()
    .then(() => {
      const userData = localStorage.getItem('')
      assert.isNull(userData)
      done()
    })
  })

})
