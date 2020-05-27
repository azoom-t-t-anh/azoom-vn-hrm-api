import { timesheetApplicationCollection } from '@root/database'
import { format } from 'date-fns/fp'
import { timesheetAppIdPrefix } from '@root/constants.js'
import sendNotificationSlackBot from '@routes/slack/notification/post.js'
import { execute } from '@root/util'
import { getSlackIdsByPermission } from '@routes/applications/leaves/post.js'

export default async (req, res) => {
  const userId = req.user.id
  const newTimesheetApp = req.body
  const id = timesheetAppIdPrefix + '_' + format('yyyyMMdd-HHmmss', new Date())
  const defaultTimesheetApp = {
    id,
    userId,
    approvalUsers: [],
    startTime: '',
    endTime: '',
    requiredDates: '',
    timesheetId: userId + '_' + format('yyyyMMdd', new Date(newTimesheetApp.requiredDates)),
    requiredContent: '',
    status: -1,
    isActive: 1,
    created: new Date(),
    updated: '',
  }
  const saveTimesheetApp = { ...defaultTimesheetApp, ...newTimesheetApp }
  await createNewTimesheetApplication(saveTimesheetApp)
  let slackIds = await getSlackIdsByPermission()
  await sendNofification(slackIds, req.user.slackId, id)
  return res.send(saveTimesheetApp)
}

const createNewTimesheetApplication = async (newTimesheetApp) => {
  return timesheetApplicationCollection().doc(newTimesheetApp.id).set(newTimesheetApp)
}

const sendNofification = async (receiverIds, senderId, requestId) => {
  const notification = {
    receiverIds,
    senderId,
    requestId,
    title: 'Đơn xin điều chỉnh bảng chấm công',
    content: 'Hi anh . Vì một số vấn đề , em xin phép đóng góp ý kiến điều chỉnh lại bảng chấm công!',
    typeId: 1,
    typeNotice: 'timesheet-application',
    options: [{ typeOption: 'button', value: 'Approve' }, { typeOption: 'button', value: 'Reject' }]
  }
  return await execute(sendNotificationSlackBot,
    {
      body: notification,
    })
}

