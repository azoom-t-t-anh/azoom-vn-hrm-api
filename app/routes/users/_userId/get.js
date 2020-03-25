import { getUserId } from '@cloudStoreDatabase/user'

module.exports = async (req, res) => {
  const userId = req.params.userId
  const user = await getUserId(userId)
  if (!user) {
    return res.sendStatus(404)
  }
  return res.send(user)
}
