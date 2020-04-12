import {
  projectMember as pmReq,
  saveProjectMember,
  isValidProjectMember
} from '@cloudStoreDatabase/project-member'
import { isAdmin } from '@helpers/check-rule'
import { getProject } from '@cloudStoreDatabase/project'

const _ = require('lodash')

module.exports = async (req, res) => {
  const { projectId } = req.params
  const data = _.defaultsDeep(req.body, pmReq)
  data.projectId = projectId
  const project = await getProject(projectId)

  if (!(await project)) {
    return res.sendStatus(400)
  }
  if (isAdmin(req.user.positionPermissionId)) {
    if (await isValidProjectMember(data)) {
      data.createdUserId = req.user.id
      return res.send(await saveProjectMember(data))
    }
    return res.sendStatus(400)
  }

  return res.sendStatus(403)
}
