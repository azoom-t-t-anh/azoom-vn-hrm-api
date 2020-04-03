import {
  getAllLeaveApp,
  getAllLeaveAppProjectlist,
  getAllLeaveAppUserList
} from '@cloudStoreDatabase/leave-application'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

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
    const projectlist = await getManagerProjectList(req.user.id)
    const memberList = await getProjectIdMemberList(
      projectlist.map(item => item.id)
    )

    return res.send(
      await getAllLeaveAppUserList(
        pageNumber,
        count,
        memberList.map(item => item.id)
      )
    )
  }
  return res.send(
    await getAllLeaveAppUserList(pageNumber, count, [req.user.id])
  )
}
