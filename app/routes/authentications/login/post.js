
/**
 * src/controllers/auth.js
 */
import { generateToken } from '@helpers/jwt-helper'

const tokenList = {};
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
export default async function(req, res) {
  try {
    if(req.body.email){
      //get user's infomation
      const userFakeData = {
        _id: "1234-5678-910JQK-tqd",
        name: "vudung",
        email: req.body.email,
      }
      const accessToken = await generateToken(userFakeData, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
      const refreshToken = await generateToken(userFakeData, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);
      tokenList[refreshToken] = {accessToken, refreshToken}
      return res.status(200).json({accessToken, refreshToken})
    }
    else {
      return res.status(400).json({'status': false,'message':'error', 'data':''})
    
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
}
