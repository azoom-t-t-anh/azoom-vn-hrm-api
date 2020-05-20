import { leaveApplicationCollection } from '@root/database.js'
import { applicationStatus } from '@root/constants.js'
import getRole from '@helpers/users/getRole'
import { getLeaveApplication } from '@routes/applications/leaves/_leaveAppId/get.js'

export default async (req, res) => {
  try {
    const { leaveAppId } = req.params
    const leaveApplicationSnapshot = await getLeaveApplication(leaveAppId)
    const { id, userId, status, isActive = false, approvalUsers = [] } = leaveApplicationSnapshot.exists
      ? leaveApplicationSnapshot.data()
      : {}
    if (!isActive) res.sendStatus(404)

    const role = await getRole(req.user.positionPermissionId)
    if (
      status === applicationStatus.pending &&
      approvalUsers.length === 0 &&
      (['admin', 'editor'].includes(role) || userId === req.user.id)
    ) {
      await deleteLeaveApplication(id)
      return res.send({ message: 'Successfully.' })
    }
    return res.sendStatus(403)
  } catch {
    res.sendStatus(500)
  }
}

const deleteLeaveApplication = async (id) => {
  return leaveApplicationCollection().doc(id).update({ isActive: false })
}
