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
      isAdmin(req.user.possitionPermissionId) ||
      isProjectManager(req.user.possitionPermissionId)
    )
  ) {
    return res.sendStatus(403)
  }
  const data = _.defaultsDeep(req.body, projectReq)
  if (await isValidProject(data)) {
    data.createdUserId = req.user.id
    saveProject(data)
    return res.send(data)
  }
  return res.sendStatus(400)
}
