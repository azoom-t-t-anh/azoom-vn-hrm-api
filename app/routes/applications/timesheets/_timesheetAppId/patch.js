import { execute } from '@root/util.js'
import { timesheetApplicationCollection } from '@root/database'
import { applicationStatus, permissions } from '@root/constants.js'
import getExistTimesheetApp from '@routes/applications/timesheets/_timesheetAppId/get.js'
import checkPermissionOfManager from '@helpers/project/checkPermissionOfManager'
import initNewApprovalUser from '@helpers/users/initNewApprovalUser'
import calculateApprovalPoints from '@helpers/applications/calculateApprovalPoints'
import getRole from '@helpers/users/getRole'
import firebase from 'firebase'
import sendNotificationSlackBot from '@routes/slack/notification/post.js'

export default async function(req, res) {
  const { timesheetAppId } = req.params
  const userId = req.user.id
  const { isApproved = 0 } = req.query
  const responseTimesheet = await execute(getExistTimesheetApp, { params: { timesheetAppId } } )

  if (responseTimesheet.status === 404 || !responseTimesheet.body) return res.sendStatus(404)
  const exitTimesheetApp = responseTimesheet.body
  if (exitTimesheetApp.status !== applicationStatus.pending) {
    return res.status(400).send({ message: 'This Application has been already approved/rejected.' })
  }
  const isUserEditedBefore = exitTimesheetApp.approvalUsers.find(approvalUser => approvalUser.userId === userId)
  if (isUserEditedBefore) return res.status(400).send( { message: "You have already approved/rejected this application." } )

  const role = await getRole(req.user.positionPermissionId)
  const permissionToEdit = await checkPermissionOfManager(userId, exitTimesheetApp.userId)

  if (!permissionToEdit && !['admin', 'editor'].includes(role)) return res.sendStatus(403)

  const newApprovalUser = await initNewApprovalUser(req.user, isApproved)
  const totalApprovalPoints = calculateApprovalPoints([...exitTimesheetApp.approvalUsers, newApprovalUser])
  const slackIds = exitTimesheetApp.approvalUsers
  .map((leaveApplication) => leaveApplication.slackId)
  const updateTimesheetApp = {
    updated: new Date(),
    approvalUsers: firebase.firestore.FieldValue.arrayUnion(newApprovalUser)
  }
  if (!isApproved) {
    await saveTimesheetApp(timesheetAppId, { ...updateTimesheetApp, status: applicationStatus.reject })
    await sendNofification(slackIds, req.user.slackId, exitTimesheetApp.id)
    return res.send( { message: "Rejected successfully." } )
  } else if (totalApprovalPoints >= permissions.admin) {
    await saveTimesheetApp(timesheetAppId, { ...updateTimesheetApp, status: applicationStatus.approved })
    await sendNofification(slackIds, req.user.slackId, exitTimesheetApp.id)
    return res.send( { message: "Approved successfully." } )
  } else {
    await saveTimesheetApp(timesheetAppId, updateTimesheetApp)
    await sendNofification(slackIds, req.user.slackId, exitTimesheetApp.id)
    return res.send( { message: "Approved successfully." } )
  }
}

const saveTimesheetApp = async function(timesheetAppId, timesheetApp) {
  return timesheetApplicationCollection().doc(timesheetAppId).update(timesheetApp)
}

const sendNofification = async (receiverIds, senderId, requestId) => {
  const notification = {
    receiverIds,
    senderId,
    requestId,
    title: 'Đơn xin điều chỉnh bảng chấm công',
    content: 'Hi anh .  Vì một số vấn đề , em xin phép đóng góp ý kiến điều chỉnh lại bảng chấm công!',
    typeId: 1,
    typeNotice: 'timesheet-application',
    options: [{ typeOption: 'button', value: 'Approve' }, { typeOption: 'button', value: 'Reject' }]
  }
  return await execute(sendNotificationSlackBot,
    {
      body: notification,
    })
}
