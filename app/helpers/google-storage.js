import { Storage } from '@google-cloud/storage'

export const storage = new Storage({
  projectId: process.env.FIRE_BASE_PROJECT_ID
})

export const uploadFile = async (filePath, option = {}) => {
  const res = await storage.bucket(process.env.STORAGE_BUCKET).upload(filePath)
  const acl = storage.bucket(process.env.STORAGE_BUCKET).file(filePath).acl

  const {
    groups = [],
    users = [],
    domains = ['azoom.jp'],
    allUsers = false
  } = option

  if (allUsers) {
    await acl.readers.addAllUsers()
  }

  if (users && users.length) {
    const promises = users.map(async (user) => {
      await acl.readers.addUser(user)
      return user
    })
    await Promise.all(promises)
  }

  if (groups && groups.length) {
    const promises = groups.map(async (group) => {
      await acl.readers.addGroup(group)
      return group
    })
    await Promise.all(promises)
  }

  if (domains && domains.length) {
    const promises = domains.map(async (domain) => {
      await acl.readers.addDomain(domain)
      return domain
    })
    await Promise.all(promises)
  }

  return res[0].metadata.mediaLink
}
