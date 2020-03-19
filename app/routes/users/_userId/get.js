
import {getTable as tableStore} from '@helpers/fire-base'
module.exports = async (req, res) => {
  const userId = req.params.userId
  const users = await tableStore('users').where('name', '==', 'hang').get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return false
      }
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data())
        return { id:doc.id,email:doc.data()}
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
      return res.sendStatus(500)
    })
  return res.sendStatus(200)
  }