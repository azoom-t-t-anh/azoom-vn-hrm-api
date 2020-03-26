import { generateToken } from '@helpers/jwt-helper'
import { responseJson } from '@helpers/res-result.js'
import { getTable } from '@configs/database'
import { userToken,saveToken } from '@cloudStoreDatabase/token-user'
import { getUser } from '@cloudStoreDatabase/user'

const _ = require('lodash')
const bcrypt = require('bcrypt')

export default async function (req, res) {
  try {
    const { email, password } = req.body
    const user = await getUser(email, password)

    if (user) {
      const accessToken = await generateToken(
        user,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      )
      const refreshToken = await generateToken(
        user,
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_LIFE
      )
      await saveToken(user.id, user.email, accessToken)
      responseJson.data = { accessToken, refreshToken }
      // return res.send("success",responseJson.data)
      return res.send(responseJson)
    }
    return res.sendStatus(400)
  } catch (error) {
    return res.sendStatus(500)
  }
}