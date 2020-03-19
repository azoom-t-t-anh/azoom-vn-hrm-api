
/**
 * src/controllers/auth.js
 */
import { destroyToken } from '@helpers/jwt-helper'

const tokenList = {};
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
export default async function(req, res) {
  try {
    if(req.body.email){
      const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"]
      const refreshToken = await destroyToken(tokenFromClient)
      return res.status(200).json('successfully')
    }
    else {
      return res.status(400).json({'status': false,'message':'error', 'data':''})
    
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
