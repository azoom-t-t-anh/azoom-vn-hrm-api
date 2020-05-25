import { timesheetCollection } from '@root/database'

export default async (req, res) => {
  try {
    const { timesheetAppId } = req.query
    const timesheet = req.body

    await timesheetCollection().doc(timesheetAppId).update(timesheet)
    const savedTimesheet = await timesheetCollection().doc(timesheetAppId).get()
    res.send(savedTimesheet.exists ? savedTimesheet.data() : {})
  } catch {
    res.status(500).send({ message: 'Error when save timesheet to firebase.' })
  }
}
