import firebase from 'firebase'
import _ from 'lodash/fp'
import date from 'date-and-time'
import { userCollection } from '@root/database'

const fireStore = firebase.firestore()
const officialContractType = 2
export default async (req, res) => {
  try {
    const officialUsers = await userCollection()
      .where('contractType', '==', officialContractType)
      .get()
    if (officialUsers.empty) return res.sendStatus(404)
    await fireStore.runTransaction(async (transaction) => {
      await officialUsers.forEach((user) => {
        const newTotalPaidLeaveDate = user.data().totalPaidLeaveDate + 1
        transaction.update(user.ref, {
          totalPaidLeaveDate: newTotalPaidLeaveDate,
          updated: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        })
      })
    })
    res.send({ message: 'Add paid leave successful' })
  } catch (error) {
    res.sendStatus(500)
  }
}
