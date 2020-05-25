import { timesheetCollection } from '@root/database'
import { format } from 'date-fns/fp'

export default async (req, res) => {
  try {
    const timesheet = req.body
    const timesheetId = timesheet.userId + '_' + format('yyyyMMdd', new Date())
    const saveTimesheet = {
      ...timesheet,
      id: timesheetId
    }

    await timesheetCollection().doc(saveTimesheet.id).set(saveTimesheet)
    const afterSavedTimesheet = await timesheetCollection()
      .doc(saveTimesheet.id)
      .get()
    res.send(afterSavedTimesheet.exists ? afterSavedTimesheet.data() : {})
  } catch {
    res.status(500).send({ message: 'Error when save timesheet to firebase.' })
  }
}
