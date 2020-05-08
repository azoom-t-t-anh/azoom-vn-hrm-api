import { notificationCollection } from '@root/database'
import { execute } from '@root/util.js'
import getNotification from '@routes/notifications/_notificationId/get.js'

export default async (req, res) => {
  try {
    const { notificationId } = req.params
    const existNotification = await execute(getNotification, { params: { notificationId } })
    if (existNotification.status === 404 || !existNotification.body) return res.sendStatus(404)
    await notificationCollection().doc(notificationId).update({ isActive: false })
    return res.sendStatus(200)  
  } catch {
    return res.status(500).send({ message: 'Notification delete failed' })
  }
}
