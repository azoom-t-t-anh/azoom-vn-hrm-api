import { verifyToken  } from '@helpers/jwt-helper'
import express from 'express'
import { getTable } from '@configs/database'

const router = new express.Router()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const authMiddleware = router.use( async(req, res, next) => {
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"]||'';
  if(checkRequestReferer(req.originalUrl))
  {
    return next()
  }
  const resultcheck = await checkRequestApiKey(tokenFromClient)
  if(resultcheck)
  {
    req.user = resultcheck.user
    req.token = resultcheck.token
    return next()
  }
  return res.send("No token provided.");
})

function checkRequestReferer(requestReferer) {
  const isProduction = process.env.NODE_ENV === 'production'
  const defaultApiRefererWhitelist = [
    /^(https?:\/\/)?([\w-.]*)\/login/
  ]
  const apiRefererWhiteList = isProduction
    ? defaultApiRefererWhitelist
    : [...defaultApiRefererWhitelist, /login/]
  return (
    requestReferer &&
    apiRefererWhiteList.some(referer => referer.test(requestReferer))
  )
}

async function  checkRequestApiKey(tokenFromClient) {
   try {
      const decode = await verifyToken(tokenFromClient, accessTokenSecret)
      const user = decode.data
      const token = await isToken(user.id, tokenFromClient)
      if(token.isHas){
        return {tokenFromClient:tokenFromClient,user:user,token:token}
      }
      else return false
    } catch (error) {
      return false
    }
  }
async function  isToken(userId,tokenFromClient) {

  const result = {isHas:false,data:''}
  try {
    const results = await verifyToken(tokenFromClient, accessTokenSecret)
    const user = results.data
    const tokenuser = await getTable('userToken').where('tokenCode','==',tokenFromClient).where('userId','==',user.id).where('isActive','==',true).get().then(snapshot=>
      {
        if (!snapshot.empty) {
          result.isHas = true
          snapshot.forEach(doc => {
              return result.data = doc.data()
            })
          }
        })
    return result
    } 
  catch (error){
    console.log(error)
    return error
  }
  }

