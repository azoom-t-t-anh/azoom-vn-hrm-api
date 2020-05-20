import { leaveApplicationCollection } from '@root/database'

export default async (req, res) => {
  try {
    const { leaveAppId } = req.params
    const existedLeaveApplication = await getLeaveApplication(leaveAppId)

    if (existedLeaveApplication.exists) {
      res.send(existedLeaveApplication.data())
    } else {
      res.sendStatus(404)
    }
  } catch {
    res.sendStatus(500)
  }
}

const getLeaveApplication = async (leaveAppId) => {
  return leaveApplicationCollection().doc(leaveAppId).get()
}

export { getLeaveApplication }

