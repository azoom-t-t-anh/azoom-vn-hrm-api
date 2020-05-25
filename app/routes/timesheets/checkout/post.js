import { execute } from '@root/util.js'
import getExistTimesheet from '@routes/timesheets/get.js'
import saveTimesheet from '@routes/timesheets/post.js'
import updateTimesheet from '@routes/timesheets/patch.js'
import { format } from 'date-fns/fp'
import { sendMessageToRoom } from '@root/socket'
import * as constants from '@root/constants'
import { addAdditionalDataAndFormat } from '@routes/timesheets/get'

export default async (req, res) => {
  const userId = req.user.id
  const timezone = new Date().getTimezoneOffset() / -60
  const responseTimesheet = await execute(getExistTimesheet, {
    query: {
      userIds: userId,
      time: format('yyyy-MM-dd', new Date()),
      timezone: timezone >= 0 ? `+${timezone}` : timezone
    }
  })
  const [existedTimesheet] = responseTimesheet.body
  const endTime = new Date()
  const warningMessage =
    existedTimesheet && existedTimesheet.startTime
      ? ''
      : ' But you have not checked in today.'

  if (existedTimesheet && existedTimesheet.endTime)
    return res.send({
      data: existedTimesheet.endTime,
      message: warningMessage
    })

  if (existedTimesheet && !existedTimesheet.endTime) {
    const editProperties = {
      endTime,
      updated: new Date()
    }
    const updateResult = await execute(updateTimesheet, {
      body: editProperties,
      query: { timesheetAppId: existedTimesheet.id }
    })

    if (updateResult.status !== 200) throw new Error('Internal Server Error')

    sendMessageToRoom(
      undefined,
      constants.rooms.TIMELINE,
      constants.events.LOGTIME,
      JSON.stringify(await addAdditionalDataAndFormat(updateResult.body))
    )

    return res.send({
      data: endTime,
      message: warningMessage
    })
  }

  const newTimesheet = {
    userId,
    checkedDate: new Date(),
    startTime: '',
    endTime,
    created: new Date(),
    updated: ''
  }
  const saveResult = await execute(saveTimesheet, { body: newTimesheet })

  if (saveResult.status !== 200) throw new Error('Internal Server Error')

  sendMessageToRoom(
    undefined,
    constants.rooms.TIMELINE,
    constants.events.LOGTIME,
    JSON.stringify(await addAdditionalDataAndFormat(saveResult.body))
  )

  return res.send({
    data: endTime
  })
}
