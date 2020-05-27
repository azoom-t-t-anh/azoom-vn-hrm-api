import { execute } from '@root/util.js'
import checkExistTimesheet from '@routes/timesheets/get.js'
import saveTimesheet from '@routes/timesheets/post.js'
import updateTimesheet from '@routes/timesheets/patch.js'
import { format, startOfDay } from 'date-fns/fp'
import { sendMessageToRoom } from '@root/socket'
import * as constants from '@root/constants'
import { addAdditionalDataAndFormat } from '@routes/timesheets/get'

export default async (req, res) => {
  const userId = req.user.id
  const timezone = new Date().getTimezoneOffset() / -60
  const responseTimesheet = await execute(checkExistTimesheet, {
    query: {
      userIds: userId,
      time: format('yyyy-MM-dd', new Date()),
      timezone: timezone >= 0 ? `+${timezone}` : timezone
    }
  })
  const [checkedInRecord] = responseTimesheet.body
  const startTime = new Date()

  if (checkedInRecord && checkedInRecord.startTime)
    return res.send({
      data: checkedInRecord.startTime
    })

  if (checkedInRecord && !checkedInRecord.startTime) {
    const updateProperties = {
      startTime,
      updated: new Date()
    }
    const updateResult = await execute(updateTimesheet, {
      body: updateProperties,
      query: { timesheetAppId: checkedInRecord.id }
    })

    if (updateResult.status !== 200) throw new Error('Internal Server Error')

    sendMessageToRoom(
      undefined,
      constants.rooms.TIMELINE,
      constants.events.LOGTIME,
      JSON.stringify(await addAdditionalDataAndFormat(updateResult.body))
    )
    return res.send({ data: startTime })
  }

  const newTimesheet = {
    userId,
    checkedDate: startOfDay(new Date()),
    startTime,
    endTime: '',
    created: new Date(),
    updated: new Date()
  }
  const saveResult = await execute(saveTimesheet, { body: newTimesheet })

  if (saveResult.status !== 200) throw new Error('Internal Server Error')

  sendMessageToRoom(
    undefined,
    constants.rooms.TIMELINE,
    constants.events.LOGTIME,
    JSON.stringify(await addAdditionalDataAndFormat(saveResult.body))
  )

  return res.send({ data: startTime })
}
