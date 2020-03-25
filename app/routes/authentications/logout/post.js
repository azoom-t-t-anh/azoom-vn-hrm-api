import { getTable } from '@configs/database'
import { destroyToken } from '@cloudStoreDatabase/token-user'
const _ = require('lodash')

export default async function (req, res) {
  try {
    if (req.body.email) {
      const tokenFromClient =
        req.body.token || req.query.token || req.headers['x-access-token']
      await destroyToken(tokenFromClient)
      return res.status(200).json('successfully')
    } else {
      return res.status(400).json({ status: false, message: 'error', data: '' })
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}


