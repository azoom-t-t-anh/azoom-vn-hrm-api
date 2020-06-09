import _ from 'lodash/fp'
import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  try {
    const { userId } = req.params
    const role = await getRole(req.user.positionPermissionId)
    if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)

    const user = await getUserById(userId)
    return user ? res.send(user) : res.sendStatus(404)
  } catch (error) {
    return res.sendStatus(500)
  }
}
export const getUserById = async (userId) => {
  const user = await userCollection().doc(userId).get()

  if (!user.exists) return null
  return _.omit(['password'], user.data())
}
