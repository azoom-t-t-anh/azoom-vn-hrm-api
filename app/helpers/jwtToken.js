import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'

export const generateToken = (
  { id, positionPermissionId, fullName, slackId },
  secretSignature,
  tokenLife
) => {
  return new Promise((resolve, reject) => {
    jwtSign(
      { data: { id, positionPermissionId, fullName, slackId } },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife
      },
      (error, token) => {
        if (error) {
          return reject(error)
        }
        return resolve(token)
      }
    )
  })
}

export const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwtVerify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error)
      }
      return resolve(decoded.data)
    })
  })
}
