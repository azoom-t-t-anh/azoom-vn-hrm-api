import _ from 'lodash/fp'
import bcrypt from 'bcrypt'
import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import getUserByEmail from '@routes/users/_email/get'
import getUserById from '@routes/users/_userId/get'
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
  slackId:''
}

export default async (req, res) => {
  const user = req.body

  const role = await getRole(req.user.positionPermissionId)
  if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)
  if (!isValidUser(user.id, user.email)) return res.sendStatus(400)
  const newUser = {
    ...defaultUser,
    ...user,
    id: 'azoom' + format('yyyyMMddHHmmss', new Date()),
    password: bcrypt.hashSync(user.password, 10)
  }
  await userCollection().doc(newUser.id).set(newUser)
  const savedUser = await userCollection().doc(newUser.id).get()

  res.send(savedUser.exists ? _.omit(['password'], savedUser.data()) : {})
}

const isValidUser = async (id, email) => {
  const isValidId =
    (await execute(getUserById, { params: { userId: id } })).status !== 200
  const isValidEmail =
    (await execute(getUserByEmail, { params: { email } })).status !== 200
  return isValidId & isValidEmail
}
