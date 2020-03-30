import { getAllUser } from '@cloudStoreDatabase/user'

module.exports = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''

  return res.send(await getAllUser(pageNumber, count))
}
