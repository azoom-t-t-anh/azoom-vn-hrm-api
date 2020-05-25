import { leaveApplicationCollection } from '@root/database'
export default async (req, res) => {
  const leaveApplication = req.body

  await updateLeaveApplication(leaveApplication)
  const savedLeaveApplication = await leaveApplicationCollection()
    .doc(leaveApplication.id)
    .get()
  res.send(savedLeaveApplication.exists ? savedLeaveApplication.data() : {})
}

const updateLeaveApplication = async (leaveApplication) => {
  return await leaveApplicationCollection()
    .doc(leaveApplication.id)
    .set(leaveApplication)
}
