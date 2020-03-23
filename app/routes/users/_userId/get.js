
import { getTable } from '@configs/database'
module.exports = async (req, res) => {
  const userId = req.params.userId
  const users = await tableStore('users').where('name', '==', 'hang').get()
    .then(snapshot => {
      if (snapshot.empty) {
        return false
      }
      snapshot.forEach(doc => {
        return { id:doc.id,email:doc.data()}
      })
    })
    .catch(err => {
      return res.sendStatus(500)
    })
  return res.sendStatus(200)
  }