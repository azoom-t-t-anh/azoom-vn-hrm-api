import {
  getAllTsA,
  getAllTsAppProjectlist
} from '@cloudStoreDatabase/timesheet-application'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

module.exports = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''

  if (
    isAdmin(req.user.possitionPermissionId) ||
    isEditor(req.user.possitionPermissionId)
  ) {
    return res.send(await getAllTsA(pageNumber, count))
  }
  if (isProjectManager(req.user.possitionPermissionId)) {
    const projectlist = await getManagerProjectList(req.user.id)

    return res.send(
      await getAllTsAppProjectlist(
        pageNumber,
        count,
        projectlist.map(item => item.id)
      )
    )
  }
  return  res.sendStatus(403)
}
