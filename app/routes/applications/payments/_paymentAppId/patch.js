import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import { applicationStatus }  from '@root/constants.js'
import initNewApprovalUser from '@helpers/users/initNewApprovalUser.js'

export default async (req, res) => {
  const userId = req.user.id
  const { paymentAppId } = req.params
  const { isApproved = 0 } = req.query
  const payment = await paymentCollection().doc(paymentAppId).get()
  if (!payment.exists) return res.sendStatus(404)
  if (payment.data().status !== applicationStatus.pending) return res.sendStatus(400)

  const role = await getRole(req.user.positionPermissionId)
  if (role !== 'admin') return res.sendStatus(403)

  const newApprovalUsers = await initNewApprovalUser(userId, isApproved)
  const updatedPaymentApp = {
    updated: new Date(),
    status: Number(isApproved),
    approvalUsers: [
      newApprovalUsers
    ]
  }
  await updatePayment(paymentAppId, updatedPaymentApp)
  return res.sendStatus(200)
}

const updatePayment = async (paymentAppId, updatedPaymentApp) => {
  return paymentCollection().doc(paymentAppId).update(updatedPaymentApp)
}
