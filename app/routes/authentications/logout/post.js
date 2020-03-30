import {
  destroyToken,
  destroyALLTokenOfUser
} from '@cloudStoreDatabase/token-user'

export default async function (req, res) {
  const { isAll = false } = req.query
  if (isAll) {
    await destroyALLTokenOfUser(req.user.id, req.token.data)
  } else {
    await destroyToken(req.token.tokenCode)
  }
  return res.status(200).json('Logout successfully')
}
