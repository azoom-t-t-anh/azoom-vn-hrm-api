import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import { format } from 'date-fns/fp'
import { paymentIdPrefix } from '@root/constants.js'

export default async (req, res) => {
  const userId = req.user.id
  const payment = req.body

  const role = await getRole(req.user.positionPermissionId)
  if(!role) return res.sendStatus(403)

  const id = paymentIdPrefix + '-' + format('yyyyMMddHHmmss', new Date())

  const defaultPayment = {
    id,
    userId,
    status: -1,
    reason: '',
    amount: '',
    isActive: false,
    created: new Date(),
    updated: ''
  }
  
  const newPayment = {...defaultPayment, ...payment}
  await createNewPayment(newPayment.id, newPayment)
  return res.send(newPayment)
}

const createNewPayment = async (newPaymentId, newPayment) => {
  return paymentCollection().doc(newPaymentId).set(newPayment)
}

