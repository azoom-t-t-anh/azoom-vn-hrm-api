
import { getTable } from '@helpers/fire-base'

module.exports = async (req, res) => {
  const resbody = { 'status':true,'message':'oke','messageCode':'001','data':{'name':'dung'}}
  const users = await getTable('users').get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return false;
      }
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        return { id:doc.id,email:doc.data()};
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
      return res.sendStatus(500);
    });
  return res.status(200).json(resbody);
}
