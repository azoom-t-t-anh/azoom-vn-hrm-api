import { getTable } from '@configs/database'
import { isProjectManager, isAdmin } from '@helpers/check-rule'
import { getUserId } from '@cloudStoreDatabase/user'

const date = require('date-and-time')

export const project = {
  id: '',
  projectName: '',
  managerId: '',
  createdUserId: '',
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: ''
}

export const isValidProject = async data => {
  const manager = await getUserId(data.managerId)
  if (manager) {
    if (
      (isAdmin(manager.possitionPermissionId) ||
        isProjectManager(manager.possitionPermissionId)) &&
      !(await checkIdProjectExist(data.id))
    ) {
      return true
    }
  }
  return false
}

export const checkIdProjectExist = async projectId => {
  const queryData = await getTable(process.env.DB_TABLE_PROJECT)
    .where('id', '==', projectId)
    .get()
  return !queryData.empty
}

export const saveProject = async data => {
  const project = await getTable(process.env.DB_TABLE_PROJECT)
    .doc(data.id)
    .set(data)
  return project
}

export const getProject = async projectId => {
  const queryData = await getTable(process.env.DB_TABLE_PROJECT)
    .where('id', '==', projectId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const checkProjectManager = async (projectId, managerId) => {
  const queryData = await getTable(process.env.DB_TABLE_PROJECT)
    .where('id', '==', projectId)
    .where('managerId', '==', managerId)
    .get()
  return !queryData.empty
}
export const getManagerProjectList = async managerId => {
  const queryData = await getTable(process.env.DB_TABLE_PROJECT)
    .where('managerId', '==', managerId)
    .get()
  return queryData.empty ? [] : queryData.docs.map(doc => doc.data())
}
