
/**
 * src/controllers/auth.js
 */
import { generateToken } from '@helpers/jwt.helper'
const debug = console.log.bind(console);

let tokenList = {};

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
console.log(process.env)

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
export default async function(req, res) {
  try {
    // const {email, password}=res.body
    console.log(req)
  
    if(req.body.email){
      debug(`Thực hiện fake thông tin user...`);
      const userFakeData = {
        _id: "1234-5678-910JQK-tqd",
        name: "vudung",
        email: req.body.email,
      };
      console.log(userFakeData)
      debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
      const accessToken = await generateToken(userFakeData, accessTokenSecret, accessTokenLife);
      
      debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
      const refreshToken = await generateToken(userFakeData, refreshTokenSecret, refreshTokenLife);

      tokenList[refreshToken] = {accessToken, refreshToken};
      
      debug(`Gửi Token và Refresh Token về cho client...`);
      return res.status(200).json({accessToken, refreshToken});
    }
    else {
      return res.status(400).json({'status': false,'message':'error', 'data':''});
    
    }
      
  } catch (error) {
    console.log("khohdfidhgkuhf")
    console.log(error)
    return res.status(500).json(error);
  }
}
