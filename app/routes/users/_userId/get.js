import _ from 'lodash/fp'
import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  try {
    const { userId } = req.params
    const role = await getRole(req.user.positionPermissionId)
    if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)

    const user = await userCollection().doc(userId).get()
    if (!user.exists) return res.sendStatus(404)

    return res.send(_.omit(['password'], user.data()))
  } catch (error) {
    return res.sendStatus(500)
  }
}
