
import { getTable } from '@configs/database'

module.exports = async (req, res) => {
  const resbody = { 'status':true,'message':'oke','messageCode':'001','data':{'name':'dung'}}
  const users = await getTable('users').get()
    .then(snapshot => {
      if (snapshot.empty) {
        return false;
      }
      snapshot.forEach(doc => {
        return { id:doc.id,email:doc.data()};
      });
    })
    .catch(err => {
      return res.sendStatus(500);
    });
  return res.status(200).json(resbody);
}
