import {
  user as userReq,
  saveUser,
  isValidUser
} from '@cloudStoreDatabase/user'

import { isAdmin, isEditor } from '@helpers/check-rule'

const _ = require('lodash')

module.exports = async (req, res) => {
  if (
    isAdmin(req.user.positionPermissionId) ||
    isEditor(req.user.positionPermissionId)
  ) {
    const data = _.defaultsDeep(req.body, userReq)
    if (await isValidUser(data.id, data.email)) {
      saveUser(data)
      return res.send(data)
    }
    return res.sendStatus(400)
  }

  return res.sendStatus(403)
}
