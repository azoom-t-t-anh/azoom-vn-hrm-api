import { timesheetApplicationCollection } from '@root/database'

export default async (req, res) => {
  try {
    const { timesheetAppId } = req.params
    const existTimesheetApplication = await getTimesheetApplication(timesheetAppId)

    if (existTimesheetApplication.exists) {
      res.send(existTimesheetApplication.data())
    } else {
      res.send(null)
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

const getTimesheetApplication = async (timesheetAppId) => {
  return await timesheetApplicationCollection()
    .doc(timesheetAppId)
    .get()
}
