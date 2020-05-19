import { execute } from '@root/util'
import getNotifications from '@routes/notifications/get.js'
import upadteNotification from '@routes/notifications/_notificationId/put.js'
import sendNofificationSlackBot from '@routes/slack/notification/post.js'

export default async (req, res) => {
  try {
    const results = await execute(getNotifications, {})
    const notifications = results.status === 200 ? results.body : []
    if (!notifications.length) return res.sendStatus(200)
    await notifications.forEach(async (notifcation) => {
      const send = await sendNofification(notifcation)
      if (send.status !== 200) {
        await updateNotifcation(notifcation.notifiId, false)
      } else {
        const statusNotification = send.body.every(element => element.status === true)
        await updateNotifcation(notifcation.notifiId, statusNotification)
      }
    });
    return res.send({ message: 'Resend notifications successful.' })
  } catch {
    res.sendStatus(500)
  }
}

const sendNofification = async (notification) => {
  return await execute(sendNofificationSlackBot,
    {
      body: notification,
    })
}

const updateNotifcation = async (notificationId, status) => {
  return await execute(upadteNotification,
    {
      body: { status },
      params: { notificationId }
    })
}
