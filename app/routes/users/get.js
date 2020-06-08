import _ from 'lodash/fp'
import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import { firestore } from 'firebase'

export default async (req, res) => {
  let { page = 1, limit = 15, userIds= "[]" } = req.query
  const role = await getRole(req.user.positionPermissionId)
  if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)
  
  // TODO: page, limit must be greater than 0  (handle be OpenAPI)
  // TODO: remove 2 line parser below when openAPI is applied
  userIds = Array.from(JSON.parse(userIds))
  page = parseInt(page)
  limit = parseInt(limit)
  res.send(await getUserList({ page, limit, userIds }))
}
const getUserList = async ({ page = 1, limit, userIds }) => {
  const queryUserList = userIds && userIds.length
  ? userCollection()
    .where('isActive', '==', 1)
    .where(firestore.FieldPath.documentId(), 'in', userIds)
    .orderBy('__name__')
  : userCollection()
    .where('isActive', '==', 1)
    .orderBy('__name__')

  const allUsersSnapshot = await queryUserList.get()
  const total = allUsersSnapshot.empty ? 0 : allUsersSnapshot.docs.length

  if (limit === -1) {
    if (allUsersSnapshot.empty) return []
    const users = allUsersSnapshot.docs.map((user) => _.omit(['password'], user.data()))
    return {
      data: users,
      total
    }
  }

  const totalIgnoreUser = (page - 1) * limit

  if (totalIgnoreUser === 0) {
    const users = await queryUserList
      .limit(limit)
      .get()
    if (users.empty) return []

    return {
      total,
      data: users.docs.map((user) => _.omit(['password'], user.data()))
    }
  } else {
    const ignoreUsers = await queryUserList
      .limit(totalIgnoreUser)
      .get()
    if (ignoreUsers.empty) return []

    const lastIgnoreUser = ignoreUsers.docs[ignoreUsers.docs.length - 1].data()
    const users = await queryUserList
      .startAfter(lastIgnoreUser.id)
      .limit(limit)
      .get()

    return {
      total,
      data: users.docs.map((user) => _.omit(['password'], user.data()))
    }
  }
}
export { getUserList }
