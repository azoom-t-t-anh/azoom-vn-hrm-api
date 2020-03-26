import { getTable } from '@configs/database'
import { isProjectManager, isAdmin } from '@helpers/check-rule'
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
  const users = await getTable(process.env.DB_TABLE_PROJECT_MEMBER)
    .doc(data.id)
    .set(data)
  return users
}
