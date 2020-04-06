import {
  project as projectReq,
  saveProject,
  isValidProject
} from '@cloudStoreDatabase/project'
import { isAdmin, isProjectManager } from '@helpers/check-rule'

const _ = require('lodash')

module.exports = async (req, res) => {
  if (
    !(
      isAdmin(req.user.positionPermissionId) ||
      isProjectManager(req.user.positionPermissionId)
    )
  ) {
    return res.sendStatus(403)
  }
  const data = _.defaultsDeep(req.body, projectReq)
  console.log(req.user)

  if (await isValidProject(data)) {
    data.createdUserId = req.user.id
    saveProject(data)
    return res.send(data)
  }
  return res.sendStatus(400)
}
