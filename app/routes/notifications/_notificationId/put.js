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
    await updateNotification(req.params.notificationId, data)
    return res.send(data)
  } catch {
    return res.status(500).send({ message: 'Notification update failed' })
  }
}

const updateNotification = async (id, data) => {
  return notificationCollection().doc(id).update(data)
}
