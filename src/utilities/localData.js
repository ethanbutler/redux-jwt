const STORAGE_ID = 'userData'

export const loadUserData = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_ID)
    if(serializedState !== null) {
      return JSON.parse(serializedState)
    } else {
      return undefined
    }
  }
  catch(err){
    return undefined
  }
}

export const saveUserData = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STORAGE_ID, serializedState)
  }
  catch(err) {
    console.log(err)
  }
}

export const clearUserData = () => {
  try {
    localStorage.removeItem(STORAGE_ID)
  }
  catch(err) {
    console.log(err)
  }
}

export default {
  loadUserData,
  saveUserData,
  clearUserData
}
