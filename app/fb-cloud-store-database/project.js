import { isProjectManager, isAdmin } from '@helpers/check-rule'
import { getUserId } from '@cloudStoreDatabase/user'

const date = require('date-and-time')
const firebase = require('firebase')

const projectCollection = () => {
  return firebase.firestore().collection(process.env.DB_TABLE_PROJECT)
}

export const project = {
  id: '',
  projectName: '',
  createdUserId: '',
  startDate: '',
  endDate: '',
  status: -1,
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: ''
}

export const isValidProject = async data => {
  const manager = await getUserId(data.managerId)
  if (manager) {
    if (
      (isAdmin(manager.positionPermissionId) ||
        isProjectManager(manager.positionPermissionId)) &&
      !(await getProject(data.id))
    ) {
      return true
    }
  }
  return false
}

export const saveProject = async data => {
  const project = await projectCollection()
    .doc(data.id)
    .set(data)
  return project
}

export const getProject = async projectId => {
  const queryData = await projectCollection()
    .where('id', '==', projectId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const checkProjectManager = async (projectId, managerId) => {
  const queryData = await projectCollection()
    .where('id', '==', projectId)
    .where('managerId', '==', managerId)
    .get()
  return !queryData.empty
}

export const getManagerProjectList = async managerId => {
  const queryData = await projectCollection()
    .where('managerId', '==', managerId)
    .get()
  return queryData.empty ? [] : queryData.docs.map(doc => doc.data())
}
