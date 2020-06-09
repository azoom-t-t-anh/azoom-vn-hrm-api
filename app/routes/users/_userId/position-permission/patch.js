import getRole from '@helpers/users/getRole'
import { getUserById } from '@routes/users/_userId/get'
import saveUser from '@routes/users/put'
import { execute } from '@root/util.js'

module.exports = async (req, res) => {
  const { userId } = req.params
  const role = await getRole(req.user.positionPermissionId)
  if (role !== 'admin') return res.sendStatus(403)
  const { positionPermissionId = 4 } = req.body
  const user = await getUserById(userId)
  if (!user) {
    user.positionPermissionId = positionPermissionId
    await execute(saveUser, { body: user })
    return res.send(user)
  }
  return res.sendStatus(400)
}
