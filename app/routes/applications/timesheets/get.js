import {
  getAllTsA,
  getAllTsAProjectlist
} from '@cloudStoreDatabase/timesheet-aplication'

import { isProjectManager, isAdmin, isEdictor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

module.exports = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''

  if (
    isAdmin(req.user.possitionPermissionId) ||
    isEdictor(req.user.possitionPermissionId)
  ) {
    return res.send(await getAllTsA(pageNumber, count))
  }
  if (isProjectManager(req.user.possitionPermissionId)) {
    //get list project of manager
    const projectlist = await getManagerProjectList(req.user.id)

    return res.send(
      await getAllTsAProjectlist(
        pageNumber,
        count,
        projectlist.map(item => item.id)
      )
    )
  }
  return res.sendStatus(403)
}
