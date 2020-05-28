import { timesheetApplicationCollection } from '@root/database'
import checkPermissionOfManager from '@helpers/project/checkPermissionOfManager'
import initNewApprovalUser from '@helpers/users/initNewApprovalUser'
import calculateApprovalPoints from '@helpers/applications/calculateApprovalPoints'
import getRole from '@helpers/users/getRole'
import firebase from 'firebase'
import { applicationStatus, permissions } from '@root/constants'
const fireStore = firebase.firestore()

export default async function (req, res) {
  try {
    const isApproved = parseInt(req.query.isApproved)
    const userId = req.user.id
    const role = ['admin', 'editor'].includes(await getRole(req.user.positionPermissionId))

    const pendingTimesheetApps = await getPendingTimesheetApps()
    if (pendingTimesheetApps.empty) return res.sendStatus(200)
    const newApprovalUser = await initNewApprovalUser(req.user, isApproved)
    const timesheetApps = await Promise.all(pendingTimesheetApps.docs.map(async (doc) => {
      let timesheetApp = doc.data()
      timesheetApp.permissionToEdit = await checkPermissionOfManager(userId, timesheetApp.userId)
      timesheetApp.ref = doc.ref
      return { ...timesheetApp, newApprovalUser }
    }))
    if (role) await updateTimesheetApplications(timesheetApps, isApproved, userId)

    return res.send({ message: 'Approved/Reject successful applications.' })

  } catch {
    return res.sendStatus(500)
  }
}

const getPendingTimesheetApps = async function () {
  return timesheetApplicationCollection().where('status', '==', applicationStatus.pending).get()
}

const updateTimesheetApplications = async (timesheetApps, isApproved, userId) => {

  return await fireStore.runTransaction(async (transaction) => {
    await timesheetApps.forEach(async (timesheetApp) => {
      const isUserEditedBefore = timesheetApp.approvalUsers.find(approvalUser => approvalUser.userId === userId)
      if (!isUserEditedBefore) {
        if (timesheetApp.permissionToEdit) {
          const totalApprovalPoints = calculateApprovalPoints([...timesheetApp.approvalUsers, timesheetApp.newApprovalUser])
          const updateTimesheetApp = {
            updated: new Date(),
            approvalUsers: firebase.firestore.FieldValue.arrayUnion(timesheetApp.newApprovalUser)
          }
          if (!isApproved) {
            updateTimesheetApp.status = applicationStatus.rejected
          } else if (totalApprovalPoints >= permissions.admin) {
            updateTimesheetApp.status = applicationStatus.approved
          }
          await transaction.update(timesheetApp.ref, updateTimesheetApp)
        }
      }
    })
  })

}
