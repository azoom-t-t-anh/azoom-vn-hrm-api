
import { getTable } from '@configs/database'
import {user as userReq} from '@models/user'

const bcrypt = require('bcrypt')
const _ = require("lodash")

module.exports = async (req, res) => {
  const resbody = { 'status':true,'message':'oke','messageCode':'001','data':{'name':'dung'}}
  const data =_.defaultsDeep(req.body,userReq)
  data.password = bcrypt.hashSync(data.password, 10)
  await saveUser(data)
  return res.status(200).json(resbody);
}

const saveUser = async(userReq) => {
  const users = await getTable('users').doc(userReq.id).set(userReq)
  return users
}
