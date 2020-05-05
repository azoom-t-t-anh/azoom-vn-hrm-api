import firebase from 'firebase'
import _ from 'lodash/fp'
import { format } from 'date-fns/fp'
import { userCollection } from '@root/database'
import authGoogleSchedulerReq from '@helpers/users/authGoogleSchedulerReq'
const fireStore = firebase.firestore()
const officialContractType = 2

export default async (req, res) => {
  try {
    const authToken = req.header('AUTHORIZATION') || ''
    const isValidToken = await authGoogleSchedulerReq(authToken)
    if (!isValidToken) return res.sendStatus(401)
    const officialUsers = await userCollection()
      .where('contractType', '==', officialContractType)
      .get()
    if (officialUsers.empty) return res.sendStatus(404)
    await fireStore.runTransaction(async (transaction) => {
      await officialUsers.forEach((user) => {
        const newTotalPaidLeaveDate = user.data().totalPaidLeaveDate + 1
        transaction.update(user.ref, {
          totalPaidLeaveDate: newTotalPaidLeaveDate,
          updated: format('YYYY/MM/DD HH:mm:ss', new Date())
        })
      })
    })
    res.send({ message: 'Add paid leave successful' })
  } catch (error) {
    res.sendStatus(500)
  }
}
