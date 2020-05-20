import { notificationCollection } from '@root/database'
import { format } from 'date-fns/fp'

export default async (req, res) => {
  try {
    const data = await getNotificationByStatus()
    return res.send(data)
  } catch {
    res.status(500).send({ message: 'Error when get notifications from firebase.' })
  }
}

const getNotificationByStatus = async (status = false) => {
  const results = await notificationCollection().where('status', '==', status).get()
  return results.docs
    .map((doc) => {
      return {
        ...doc.data(),
        created: format('yyyy/MM/dd HH:mm:ss', doc.data().created.toDate())
      }
    })
}
