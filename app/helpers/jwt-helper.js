/**
 * auth.js
 */
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'
import JWTR from 'jwt-redis';

/**
 * private function generateToken
 * @param user 
 * @param secretSignature 
 * @param tokenLife 
 */
export const generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
    jwtSign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        return resolve(token);
    });
  });
}

/**
 * This module used for verify jwt token
 * @param {*} token 
 * @param {*} secretKey 
 */
export const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwtVerify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
export const destroyToken = (tokenCode) => {
  return true
  
}
/**
 * auth.js
 */
// import { sign as jwtSign, verify as jwtVerify,destroy as destroyToken } from 'jsonwebtoken'
// const redis = require('redis');
// import JWTR from 'jwt-redis';
// const redisClient = redis.createClient();
// const jwtr = new JWTR(redisClient);

// /**
//  * private function generateToken
//  * @param user 
//  * @param secretSignature 
//  * @param tokenLife 
//  */
// export const generateToken = (user, secretSignature, tokenLife) => {
//   const userData = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//   }
//   // jwtr.sign({data: userData}, secretSignature,{
//   //       algorithm: "HS256",
//   //       expiresIn: tokenLife,
//   //     })
//   return new Promise((resolve, reject) => {
//     const userData = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//     }
//     console.log('*************************************')
//     console.log(userData)
//     resolve(jwtr.sign({data: userData}, secretSignature,{algorithm: "HS256",expiresIn: tokenLife}))
//     // jwtr.sign(
//     //   {data: userData},
//     //   secretSignature,
//     //   {
//     //     algorithm: "HS256",
//     //     expiresIn: tokenLife,
//     //   },
//     //   (error, token) => {
//     //     if (error) {
//     //       return reject(error)
//     //     }
//     //     console(token)
//     //     resolve(token)
//     // });
//   })
// }

// /**
//  * This module used for verify jwt token
//  * @param {*} token 
//  * @param {*} secretKey 
//  */
// export const verifyToken = (token, secretKey) => {
//   return new Promise((resolve, reject) => {
//     jwtr.verify(token, secretKey, (error, decoded) => {
//       if (error) {
//         return reject(error)
//       }
//       resolve(decoded)
//     });
//   });
// }
// export const destroyToken = ( tokenCode) => {
//   jwtr.destroy(tokenCode)
// }
// // export const destroyToken = ( tokenCode) => {
// //   jwtr.destroy(tokenCode)
// // }


