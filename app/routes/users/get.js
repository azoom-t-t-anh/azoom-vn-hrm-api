import {getAllUser}from '@cloudStoreDatabase/user'

module.exports = async (req, res) => {
  return res.send(await getAllUser())
}