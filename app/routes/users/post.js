import _ from 'lodash/fp'
import bcrypt from 'bcrypt'
import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import getUserByEmail from '@routes/users/_email/get'
import { getUserById } from '@routes/users/_userId/get'
import { execute } from '@root/util.js'
import { format } from 'date-fns/fp'

const defaultUser = {
  id: '',
  userName: '',
  fullName: '',
  email: '',
  password: '',
  birthDate: '',
  address: '',
  tel: '',
  zipCode: '',
  totalPaidLeaveDate: 0,
  contractType: 0,
  position: 'Dev',
  positionPermissionId: 1,
  isActive: 1,
  created: new Date(),
  updated: '',
  slackId: '',
  startDate: '',
  endDate: ''
}

export default async (req, res) => {
  const user = req.body

  const role = await getRole(req.user.positionPermissionId)
  if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)
  const validUser = await isInexistentUser(user.id, user.email)
  if (!validUser) return res.sendStatus(400)
  const newUser = {
    ...defaultUser,
    ...user,
    password: bcrypt.hashSync(user.password, 10)
  }
  await userCollection().doc(newUser.id).set(newUser)
  const savedUser = await userCollection().doc(newUser.id).get()

  return res.send(savedUser.exists ? _.omit(['password'], savedUser.data()) : {})
}

const isInexistentUser = async (id, email) => {
  const isInexistentId = !(await getUserById(id))
  const isInexistentEmail =
    (await execute(getUserByEmail, { params: { email } })).status !== 200
  return isInexistentId & isInexistentEmail
}
