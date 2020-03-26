import { getTable } from '@configs/database'

const date = require('date-and-time')
const _ = require('lodash')
const bcrypt = require('bcrypt')

export const user = {
  id: '',
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  birthDate: '',
  address: '',
  tel: '',
  zipCode: '',
  dateJoined: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  profileImage: '',
  possitionPermissionId: 4,
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: ''
}

export const isValidUser = async (id, email) => {
  if ((await checkEmailExist(email)) || (await checkIdUserExist(id))) {
    return false
  }
  return true
}

export const checkEmailExist = async useremail => {
  const queryData = await getTable(process.env.DB_TABLE_USER)
    .where('email', '==', useremail)
    .get()
  return !queryData.empty
}

export const checkIdUserExist = async userId => {
  const queryData = await getTable(process.env.DB_TABLE_USER)
    .where('id', '==', userId)
    .get()
  return !queryData.empty
}

export const saveUser = async data => {
  data.password = bcrypt.hashSync(data.password, 10)
  const users = await getTable(process.env.DB_TABLE_USER)
    .doc(data.id)
    .set(data)
  return users
}

export const updateUser = async (userId, dataReq) => {
  const queryData = await getTable(process.env.DB_TABLE_USER)
    .where('id', '==', userId)
    .get()
  queryData.docs.map(item =>
    getTable(process.env.DB_TABLE_USER)
      .doc(item.id)
      .update(dataReq)
  )

  return queryData.empty ? '' : queryData.docs[0].data()
}

export const deleteUser = () => {
  return
}

export const getAllUser = async (page, number) => {
  const result = { count: 0, data: [] }
  const query = await getTable(process.env.DB_TABLE_USER).orderBy(
    'created',
    'desc'
  )
  const datall = await query.get()
  result.count = await datall.docs.length
  const queryData = (await page)
    ? query
        .startAt(page)
        .limit(number)
        .get()
    : await datall
  result.data = await queryData.docs.map(doc => doc.data())
  return result
}

export const getUserId = async userId => {
  const queryData = await getTable(process.env.DB_TABLE_USER)
    .where('id', '==', userId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const getUser = async (email, password) => {
  const queryData = await getTable(process.env.DB_TABLE_USER)
    .where('email', '==', email)
    .get()
  const userDoc = queryData.docs.find(doc =>
    bcrypt.compare(password, doc.data().password)
  )
  return userDoc ? userDoc.data() : ''
}
