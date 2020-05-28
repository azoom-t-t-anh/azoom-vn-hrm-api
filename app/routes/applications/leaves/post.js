import { execute } from '@root/util'
import saveLeaveApplication from '@routes/applications/leaves/put.js'
import { applicationStatus } from '@root/constants.js'
import { parse, eachDayOfInterval, format } from 'date-fns/fp'
import { userCollection } from '@root/database'
import sendNotificationSlackBot from '@routes/slack/notification/post.js'
import {permissions} from '@root/constants'

export default async (req, res) => {
  const {
    startDate,
    endDate,
    leaveTypeId,
    userId = req.user.id,
    requiredContent
  } = req.body

  const requiredDates = eachDayOfInterval({
    start: parse(new Date(), 'yyyy/MM/dd', startDate),
    end: parse(new Date(), 'yyyy/MM/dd', endDate)
  }).map((date) => format('yyyy/MM/dd', date))
  const id = setId(userId)
  const data = {
    id,
    userId,
    requiredDates,
    requiredContent,
    leaveTypeId,
    createdDate: new Date(),
    status: applicationStatus.pending,
    isActive: true,
    approvalUsers: []
  }
  const result = await execute(saveLeaveApplication, { body: data })
  if (result.status !== 200) {
    return res.send(result.status)
  }
  let slackIds = await getSlackIdsByPermission()
  await sendNofification(slackIds, req.user.slackId, id)
  return res.send(result.body)
}

const setId = (id) => {
  return id + format('yyyyMMddHHmmss', new Date())
}

const getSlackIdsByPermission = async () => {
  let results = await userCollection()
    .where('positionPermissionId',
      'in',
      [permissions.editor, permissions.admin])
    .get()
  return results.docs
    .map((doc) => doc.data().slackId)
    .filter((slackId) => slackId)
}

export { getSlackIdsByPermission }

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
