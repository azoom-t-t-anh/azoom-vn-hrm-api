import { notificationCollection } from '@root/database'

export default async (req, res) => {
  try {
    const notification = await getNotification(req.params.notificationId)
    if (!notification.exists) return res.sendStatus(404)
    return res.send(notification.data())
  } catch (error) {
    return res.sendStatus(500)
  }
}

const getNotification = async (id) => {
  return notificationCollection().doc(id).get()
}

export { getNotification }
