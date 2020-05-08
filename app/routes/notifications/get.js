import { notificationCollection } from '@root/database'
import { format } from 'date-fns/fp'

export default async (req, res) => {
  try {
    const results = await notificationCollection().where('status', '==', false).get()
    return res.send(results.docs
      .map((doc) => {
        return {
          ...doc.data(),
          created: format('yyyy/MM/dd HH:mm:ss', doc.data().created.toDate())
        }
      }))
  } catch {
    res.status(500).send({ message: 'Error when get notifications from firebase.' })
  }
}



