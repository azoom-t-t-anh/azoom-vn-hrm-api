const firebase = require('firebase')

const fireStore = firebase.firestore()

export const timesheetApplicationCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
}

export const projectCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_PROJECT)
}

export const userCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_USER)
}

export const timesheetCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_TIME_SHEET)
}
