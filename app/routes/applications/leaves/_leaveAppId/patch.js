import { execute } from '@root/util'
import { applicationStatus } from '@root/constants.js'
import getLeaveApp from '@routes/applications/leaves/_leaveAppId/get'
import saveLeaveApplication from '@routes/applications/leaves/put'
import checkPermissionOfManager from '@helpers/project/checkPermissionOfManager'
import getTimesheetUserDate from '@routes/timesheets/get'
import saveTimesheet from '@routes/timesheets/post'
import updateTimesheet from '@routes/timesheets/patch'
import newApprovalUser from '@helpers/users/initNewApprovalUser'
import calculateApprovalPoints from '@helpers/applications/calculateApprovalPoints'
import getRole from '@helpers/users/getRole'
import { format } from 'date-fns/fp'
import sendNotificationSlackBot from '@routes/slack/notification/post.js'

const timesheet = {
  id: '',
  userId: '',
  startTime: '',
  endTime: '',
  leaveTypeId: '',
  checkedDate: format('yyyy/MM/dd', new Date()),
  isCorrect: false
}

export default async (req, res) => {
  const { leaveAppId } = req.params
  let { isApproved = 0 } = req.query

  //TODO: remove this line when turned on the validation
  isApproved = parseInt(isApproved)

  const leaveAppResponse = await execute(getLeaveApp, {
    params: { leaveAppId }
  })
  if (leaveAppResponse.status !== 200) {
    return res.sendStatus(leaveAppResponse.status)
  }
  const existedLeaveApplication = leaveAppResponse.body
  if (existedLeaveApplication.status !== applicationStatus.pending) {
    return res
      .status(400)
      .send({ message: 'This application has been already approved/rejected.' })
  }
  const role = await getRole(req.user.positionPermissionId)

  if (
    !(await checkPermissionOfManager(
      req.user.id,
      existedLeaveApplication.userId
    )) &&
    !['admin', 'editor'].includes(role)
  ) {
    return res.status(403).send({ message: 'Forbidden' })
  }

  const isUserEditedBefore = existedLeaveApplication.approvalUsers
    ? existedLeaveApplication.approvalUsers.find(
      (approvalUser) => approvalUser.userId === req.user.id
    )
    : false

  if (isUserEditedBefore)
    return res.status(400).send({
      message: 'This application has been already approved/rejected.'
    })
  const approvalUser = await newApprovalUser(req.user, isApproved)
  existedLeaveApplication.approvalUsers.push(approvalUser)
  const slackIds = existedLeaveApplication.approvalUsers
    .map((leaveApplication) => leaveApplication.slackId)

  if (!isApproved) {
    existedLeaveApplication.status = applicationStatus.rejected
    await execute(saveLeaveApplication, { body: existedLeaveApplication })
    await sendNofification(slackIds, req.user.slackId, existedLeaveApplication.id)
    return res.send({ message: 'Rejected successfully.' })
  }
  existedLeaveApplication.approvalCosre = await calculateApprovalPoints(
    existedLeaveApplication.approvalUsers
  )

  if (existedLeaveApplication.approvalCosre >= process.env.POSITION_ADMIN) {
    existedLeaveApplication.status = applicationStatus.approved
    updateLeaveToTimesheet(
      existedLeaveApplication.userId,
      existedLeaveApplication.requiredDates,
      existedLeaveApplication.leaveTypeId
    )
  }

  await execute(saveLeaveApplication, { body: existedLeaveApplication })
  await sendNofification(slackIds, req.user.slackId, existedLeaveApplication.id)
  return res.send({ message: 'Approved successfully.' })
}
//TODO: Doan nay logic co van de
const updateLeaveToTimesheet = async (userId, dateList, leaveTypeId) => {
  dateList.forEach(async (time) => {
    const timesheetUserDateResponse = await execute(getTimesheetUserDate, {
      params: { userId, time }
    })
    if (timesheetUserDateResponse.status !== 200) {
      timesheet.userId = userId
      timesheet.checkedDate = time
      timesheet.leaveTypeId = leaveTypeId
      await execute(saveTimesheet, { body: timesheet })
    } else {
      const data = timesheetUserDateResponse.body
      data.checkedDate = time
      data.leaveTypeId = leaveTypeId
      await execute(updateTimesheet, { body: data })
    }
  })
}

const sendNofification = async (receiverIds, senderId, requestId) => {
  const notification = {
    receiverIds,
    senderId,
    requestId,
    title: 'Đơn xin nghỉ phép',
    content: 'Hi anh. Vì lý do cá nhận , em xin phép nghỉ buổi ngày hôm nay ạ !',
    typeId: 1,
    typeNotice: 'leave-application',
    options: [{ typeOption: 'button', value: 'Approve' }, { typeOption: 'button', value: 'Reject' }]
  }
  return await execute(sendNotificationSlackBot,
    {
      body: notification,
    })
}
