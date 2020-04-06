import {
  getAllLeaveApp,
  getAllLeaveAppOfUserList
} from '@cloudStoreDatabase/leave-application'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import {
  getMemberOfProjectList,
  getProjectListOfManagerId
} from '@cloudStoreDatabase/project-member'

module.exports = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''

  if (
    isAdmin(req.user.positionPermissionId) ||
    isEditor(req.user.positionPermissionId)
  ) {
    return res.send(await getAllLeaveApp(pageNumber, count))
  }
  if (isProjectManager(req.user.positionPermissionId)) {
    const projectlist = await getProjectListOfManagerId(req.user.id)
    const memberList = await getMemberOfProjectList(
      projectlist.map(item => item.id)
    )

    return res.send(
      await getAllLeaveAppOfUserList(
        pageNumber,
        count,
        memberList.map(item => item.id)
      )
    )
  }
  return res.send(
    await getAllLeaveAppOfUserList(pageNumber, count, [req.user.id])
  )
}
