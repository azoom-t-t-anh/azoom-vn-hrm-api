import { notificationCollection } from '@root/database'
import { execute } from '@root/util.js'
import getNotification from '@routes/notifications/_notificationId/get.js'

export default async (req, res) => {
  try {
    const { notificationId } = req.params
    const existNotification = await execute(getNotification, { params: { notificationId } })
    if (existNotification.status === 404 || !existNotification.body) return res.sendStatus(404)
    await deleleNotification(notificationId)
    return res.sendStatus(200)  
  } catch {
    return res.status(500).send({ message: 'Notification delete failed' })
  }
}

const deleleNotification = async (notificationId) => {
  return notificationCollection().doc(notificationId).update({ isActive: false })
}
