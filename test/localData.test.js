import {
  loadUserData,
  saveUserData,
  clearUserData
} from "../src/utilities/localData"

const assert = require("chai").assert
const LOCAL_STORAGE_ALIAS = 'userData'
const dummyData = { hello: "world" }

describe("loadUserData", () => {


  beforeEach(() => {
    localStorage.removeItem(LOCAL_STORAGE_ALIAS)
  })

  it("loads user data if defined", () => {
    localStorage.setItem(LOCAL_STORAGE_ALIAS, JSON.stringify(dummyData))
    assert.deepEqual(loadUserData(), dummyData)
  })

  it("returns undefined if not defined", () => {
    assert.isUndefined(loadUserData())
  })
})

describe("saveUserData", () => {
  it("saves user data", () => {
    saveUserData(dummyData)
    assert.deepEqual(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS)),
      dummyData
    )
  })
})

describe("clearUserData", () => {
  it("removes user data", () => {
    localStorage.setItem(LOCAL_STORAGE_ALIAS, "test")
    clearUserData()
    assert.isNull(localStorage.getItem(LOCAL_STORAGE_ALIAS))
  })
})
