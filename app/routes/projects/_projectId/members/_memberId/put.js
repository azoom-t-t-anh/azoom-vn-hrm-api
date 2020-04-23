import _ from 'lodash/fp'
import date from 'date-and-time'
import { isAdmin } from '@helpers/check-rule'
import updateMember from '@helpers/project/updateMember'
import { projectCollection } from '@root/database.js'
import { execute } from '@root/util.js'
import getProjectId from '@routes/projects/_projectId/get.js'
import getUserId from '@routes/users/_userId/get.js'
import getMemberId from '@routes/projects/_projectId/members/_memberId/get.js'

export default async (req, res) => {
  try {
    const { projectId, memberId } = req.params
    if (!isAdmin(req.user.positionPermissionId)) return res.sendStatus(403)
    const project = await execute(getProjectId, {
      query: { projectId },
    })
    if (project.status === 404 || !project.body) return res.sendStatus(400)
    const user = await execute(getUserId, { params: { userId: memberId } })
    if (user.status === 404 || !user.body) return res.sendStatus(400)
    const member = await execute(getMemberId, {
      params: { projectId, memberId },
    })
    if (member.status === 404 || !member.body) return res.sendStatus(400)
    const { members } = project.body
    const newMember = _.defaultsDeep(member.body, req.body)
    newMember.updatedDate = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
    const updateListMember = updateMember(members, newMember)
    await projectCollection()
      .doc(projectId)
      .update({ members: updateListMember })
    return res.send(newMember)
  } catch (error) {
    res.sendStatus(500)
  }
}
