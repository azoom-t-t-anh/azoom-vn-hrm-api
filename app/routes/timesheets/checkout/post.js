import { execute } from '@root/util.js'
import getExistTimesheet from '@routes/timesheets/get.js'
import saveTimesheet from '@routes/timesheets/post.js'
import updateTimesheet from '@routes/timesheets/patch.js'
import { format } from 'date-fns/fp'

export default async (req, res) => {
  try {
    const { userId } = req.body
    const existedTimesheet = await execute(getExistTimesheet, { params: { userId, time: new Date() } })
    if (!existedTimesheet) {
      const newTimesheet = {
        userId,
        checkedDate: new Date(),
        startTime: '',
        endTime: format('HH:mm', new Date()),
        created: new Date(),
        updated: '',
      }

      await execute(saveTimesheet, { body: newTimesheet })
      return res.send({ message: 'Checkout successfully. But you have not checked in today' })
    } else {
      const editProperties = {
        endTime: format('HH:mm', new Date()),
        updated: new Date(),
      }
      const warningMessage = existedTimesheet.startTime ? '' : ' But you have not checked in today'

      if (await execute(updateTimesheet, { body: editProperties, query: { timesheetAppId: existedTimesheet.id } })) {
        return res.send({ message: `Checkout successfully.${warningMessage}` })
      }
    }
  } catch (error) {
    return res.status(500).send({ message: 'Server internal error.' })
  }
}
