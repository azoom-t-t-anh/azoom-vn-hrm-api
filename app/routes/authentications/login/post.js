
import { generateToken } from '@helpers/jwt-helper'
import { getTable } from '@configs/database'
import {userToken} from '@models/token-user'

const _ = require("lodash")
const bcrypt = require("bcrypt")


export default async function(req, res) {
  try {
    const {email,password}= req.body
    const passwordbum = bcrypt.hashSync(req.body.password, 10)
    const result = await checkLogin(email,password)

    if (result.isHas)
    {
      const user = result.data
      const accessToken = await generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
      const refreshToken = await generateToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);
      await createToken(user.id,user.email,accessToken)

      return res.status(200).json({accessToken, refreshToken})
    }

    return res.status(400).json({'status': false,'message':'error', 'data':''})
  }
  catch (error) {
    return res.status(500).json(error);
  }
}

const createToken = async(userId,emailUser,tokenCode) => {
  const id = userId+Date.now()
  const data = _.defaultsDeep({id:id, userId:userId,emailUser:emailUser,tokenCode:tokenCode},userToken)
  const tokenUser = await getTable('userToken').doc(id).set(data)

  return tokenUser
}

const checkLogin = async(email,password) => {
  const result={isHas:false, data:''}
  const tokenUser = await getTable('users').where('email', '==', email).where('password','==',password).get()
    .then(snapshot=>
    {
    if (snapshot.empty) {
        return false
      }
    snapshot.forEach(doc => {
        result.data = doc.data()
      })
    result.isHas = true
    return result
    })
  return tokenUser
}
