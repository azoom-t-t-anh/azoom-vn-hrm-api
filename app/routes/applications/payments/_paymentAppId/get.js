import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {

  const { paymentAppId } = req.params
  const role = await getRole(req.user.positionPermissionId)
  if(!['admin', 'editor'].includes(role)) return res.sendStatus(403)

  const paymentDetail = await getPayment(paymentAppId)
  if(!paymentDetail.exists) return res.sendStatus(404)
  return res.send(paymentDetail.data())
}

const getPayment = async (paymentAppId) => {
  return paymentCollection().doc(paymentAppId).get()
}

export { getPayment }
