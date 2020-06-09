import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  const data = req.body

  const role = await getRole(req.user.positionPermissionId)
  if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)
  await updateUser(data)
  res.send(data)
}

export const updateUser = async data => {
  await userCollection().doc(data.id).set(data)
}
