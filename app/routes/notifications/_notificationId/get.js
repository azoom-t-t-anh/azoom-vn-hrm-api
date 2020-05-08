import { notificationCollection } from '@root/database'

export default async (req, res) => {
  try {
    const notification = await notificationCollection().doc(req.params.notificationId).get()
    if (!notification.exists) return res.sendStatus(404)
    return res.send(notification.data())
  } catch (error) {
    return res.sendStatus(500)
  }
}
