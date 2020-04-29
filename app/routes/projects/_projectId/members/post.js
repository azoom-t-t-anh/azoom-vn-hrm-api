import firebase from 'firebase'
import date from 'date-and-time'
import _ from 'lodash/fp'
import { projectCollection } from '@root/database.js'
import { isAdmin } from '@helpers/check-rule'
import { initMember } from '@helpers/project/initMember'
import { execute } from '@root/util.js'
import getProjectId from '@routes/projects/_projectId/get.js'
import getMemberId from '@routes/projects/_projectId/members/_memberId/get.js'
import getUserId from '@routes/users/_userId/get.js'

export default async (req, res) => {
  const { projectId } = req.params
  try {
    if (!isAdmin(req.user.positionPermissionId)) return res.sendStatus(403)
    const memberProfile = _.defaultsDeep(req.body, initMember)
    const project = await execute(getProjectId, {
      query: { projectId },
    })
    if (project.status == 404 || !project.body) return res.sendStatus(404)
    const user = await execute(getUserId, {
      params: { userId: memberProfile.memberId },
    })
    if (user.status === 404 || !user.body) return res.sendStatus(404)
    const member = await execute(getMemberId, {
      params: { projectId, memberId: memberProfile.memberId },
    })
    if (member.status !== 404) return res.sendStatus(400)
    memberProfile.createdUserId = req.user.id
    memberProfile.createdDate = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
    memberProfile.fullName = user.body.fullName
    const addMember = {
      members: firebase.firestore.FieldValue.arrayUnion(memberProfile),
    }
    await projectCollection().doc(projectId).update(addMember)
    return res.send(memberProfile)
  } catch (error) {
    res.sendStatus(500)
  }
}
