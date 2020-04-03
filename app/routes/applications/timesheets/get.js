import {
  getAllTsApp,
  getAllTsAppProjectlist
} from '@cloudStoreDatabase/timesheet-application'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

module.exports = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''

  if (
    isAdmin(req.user.positionPermissionId) ||
    isEditor(req.user.positionPermissionId)
  ) {
    return res.send(await getAllTsApp(pageNumber, count))
  }
  if (isProjectManager(req.user.positionPermissionId)) {
    const projectlist = await getManagerProjectList(req.user.id)

    return res.send(
      await getAllTsAppProjectlist(
        pageNumber,
        count,
        projectlist.map(item => item.id)
      )
    )
  }
  return res.send(await getAllTsAppProjectlist(pageNumber, count, req.user.id))
}
