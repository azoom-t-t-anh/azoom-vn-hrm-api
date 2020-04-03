const date = require('date-and-time')
import { getTable } from '@configs/database'
const _ = require('lodash')

export const leaveApplication = {
  id: '',
  userId: '',
  approvalUserId: '',
  requiredDates: [],
  requiredContent: '',
  status: -1,
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: ''
}

export const isValidTsA = async data => {
  return true
}
const setId = id => {
  return id + date.format(new Date(), 'YYYYMMDDHHMMSS')
}

export const saveLeaveApplication = async data => {
  data.id = setId(data.userId)
  const leaveApp = await getTable(process.env.DB_TABLE_LEAVE_APPLICATION)
    .doc(data.id)
    .set(data)
  return leaveApp
}

export const getAllLeaveApp = async (page, number) => {
  const result = { count: 0, data: [] }
  const query = await getTable(process.env.DB_TABLE_LEAVE_APPLICATION).orderBy(
    'created',
    'desc'
  )
  const datall = await query.get()
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map(doc => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await datall.docs[page - 1 ? (page - 1) * number : page - 1].data()
          .created
      )
      .limit(number)
      .get()
    result.data = queryData.empty
      ? []
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}

export const getAllLeaveAppProjectlist = async (
  page,
  number,
  projectIdlist
) => {
  const result = { count: 0, data: [] }
  const query = await getTable(process.env.DB_TABLE_LEAVE_APPLICATION)
    .where('projectId', 'in', projectIdlist)
    .orderBy('created', 'desc')
  const datall = await query.get()
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map(doc => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await datall.docs[page - 1 ? (page - 1) * number : page - 1].data()
          .created
      )
      .limit(number)
      .get()
    result.data = queryData.empty
      ? []
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}

export const getAllLeaveAppUser = async (page, number, userId) => {
  const result = { count: 0, data: [] }
  const query = await getTable(process.env.DB_TABLE_LEAVE_APPLICATION)
    .where('userId', '==', userId)
    .orderBy('created', 'desc')
  const datall = await query.get()
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map(doc => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await datall.docs[page - 1 ? (page - 1) * number : page - 1].data()
          .created
      )
      .limit(number)
      .get()
    result.data = queryData.empty
      ? []
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}

export const updateLeaveApp = async dataReq => {
  const queryData = await getTable(process.env.DB_TABLE_LEAVE_APPLICATION)
    .where('id', '==', dataReq.id)
    .get()
  queryData.docs.map(item =>
    getTable(process.env.DB_TABLE_LEAVE_APPLICATION)
      .doc(item.id)
      .update(_.defaultsDeep(dataReq, item.data()))
  )

  return queryData.empty ? '' : queryData.docs[0].data()
}

export const getLeaveApp = async timsheetAppId => {
  const queryData = await getTable(process.env.DB_TABLE_LEAVE_APPLICATION)
    .where('id', '==', timsheetAppId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}
