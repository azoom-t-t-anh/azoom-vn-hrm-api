import { leaveApplicationCollection } from '@root/database'
export default async (req, res) => {
  await updateLeaveApplication(req.body.leaveApplication)
  res.send(leaveApplication)
}

const updateLeaveApplication = async (leaveApplication) => {
  return leaveApplicationCollection().doc(leaveApplication.id).set(leaveApplication)
}
