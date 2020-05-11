import getRole from '@helpers/users/getRole'
import getUserById from '@routes/users/_userId/get'
import saveUser from '@routes/users/put'

module.exports = async (req, res) => {
  const { userId } = req.params
  const role = await getRole(req.user.positionPermissionId)
  if (role !== 'admin') return res.sendStatus(403)
  const { positionPermissionId = 4 } = req.body
  const userResponse = await execute(getUserById, { params: { userId } })
  if (userResponse.status === 200) {
    const user = userResponse.body
    user.positionPermissionId = positionPermissionId
    await execute(saveUser, { body: user })
    res.send(user)
  }
  res.sendStatus(400)
}
