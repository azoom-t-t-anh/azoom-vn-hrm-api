import { timesheetApplicationCollection } from '@root/database'

export default async (req, res) => {
  try {
    const { timesheetAppId } = req.params
    const existTimesheetApplication = await timesheetApplicationCollection()
      .doc(timesheetAppId)
      .get()

    if (existTimesheetApplication.exists) {
      res.send(existTimesheetApplication.data())
    } else {
      res.send(null)
    }
  } catch (error) {
    res.status(500).send(error)
  }
}
