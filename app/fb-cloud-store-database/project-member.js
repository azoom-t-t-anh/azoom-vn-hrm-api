import { getTable } from '@configs/database'
import { checkIdUserExist } from '@cloudStoreDatabase/user'

const date = require('date-and-time')

export const projectMember = {
  id: '',
  projectId: '',
  memberId: '',
  isJoining: true,
  isActive: true,
  createdUserId: '',
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: ''
}

export const setProjectMemberId = (projectId, memberId) => {
  return projectId + '_' + memberId + date.format(new Date(), 'YYYYMMDD')
}

export const isValidProjectMember = async data => {
  if (
    (await checkIdUserExist(data.memberId)) &&
    !(await checkIdProjectMemberExist(data.projectId, data.memberId))
  ) {
    return true
  }
  return false
}

export const checkIdProjectMemberExist = async (projectId, memberId) => {
  const queryData = await getTable(process.env.DB_TABLE_PROJECT_MEMBER)
    .where('projectId', '==', projectId)
    .where('memberId', '==', memberId)
    .get()
  return !queryData.empty
}

export const saveProjectMember = async data => {
  data.id = setProjectMemberId(data.projectId, data.memberId)
  await getTable(process.env.DB_TABLE_PROJECT_MEMBER)
    .doc(data.id)
    .set(data)
  return data
}

export const getProjectIdMemberList = async projectIdList => {
  const queryData = await getTable(process.env.DB_TABLE_PROJECT)
    .where('projectId', 'in', projectIdList)
    .get()
  return queryData.empty ? [] : queryData.docs.map(doc => doc.data())
}
