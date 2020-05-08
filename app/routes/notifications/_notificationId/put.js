import { notificationCollection } from '@root/database'

export default async (req, res) => {
  try {
    const existNotification = await notificationCollection().doc(req.params.notificationId).get()
    if (!existNotification.exists) return res.sendStatus(404)
    const data = {
      status: req.body.status,
      triedTimes: existNotification.data().triedTimes + 1,
      updated: new Date()
    }
    await notificationCollection().doc(req.params.notificationId).update(data)
    return res.send(data)
  } catch {
    return res.status(500).send({ message: 'Notification update failed' })
  }
}
