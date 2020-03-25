import {getTable} from '@configs/database';
import {verifyToken} from '@helpers/jwt-helper';
const date = require ('date-and-time');
const _ = require ('lodash');

export const userToken = {
  id: '',
  userId: '',
  emailUser: '',
  tokenCode: '',
  dateTimeJoined: date.format (new Date (), 'YYYY/MM/DD HH:mm:ss'),
  isActive: true,
  created: date.format (new Date (), 'YYYY/MM/DD HH:mm:ss'),
  updated: '',
};

export const saveToken = async (userId, emailUser, tokenCode) => {
  const id = userId + Date.now ();
  const data = _.defaultsDeep (
    {id: id, userId: userId, emailUser: emailUser, tokenCode: tokenCode},
    userToken
  );
  const tokenUser = await getTable (process.env.DB_TABLE_USER_TOKEN)
    .doc (id)
    .set (data)
  return tokenUser
};

export const getToken = async (userId, tokenFromClient) => {
  const queryData = await getTable (process.env.DB_TABLE_USER_TOKEN)
    .where ('tokenCode', '==', tokenFromClient)
    .where ('userId', '==', userId)
    .where ('isActive', '==', true)
    .get ()
  return queryData.empty ? '' : queryData.docs[0].data ();
}

export const destroyALLTokenOfUser = async (userId, token) => {
  const data = _.defaultsDeep({ isActive: false }, token)
  const result = await getTable(process.env.DB_TABLE_USER_TOKEN)
    .where('userId', '==', userId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const data = _.defaultsDeep({ isActive: false }, doc.data())
        getTable(process.env.DB_TABLE_USER_TOKEN)
          .doc(doc.id)
          .update(data)
      })
    })
  return result
}

export const destroyToken = async (tokenFromClient) => {
  const tokenUser = await getTable(process.env.DB_TABLE_USER_TOKEN)
    .where('tokenCode', '==', tokenFromClient)
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const data = _.defaultsDeep({ isActive: false }, doc.data())
        getTable(process.env.DB_TABLE_USER_TOKEN)
          .doc(doc.id)
          .update(data)
      })
    })
  return tokenUser
}