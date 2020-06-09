import bcrypt from 'bcrypt'
import { execute } from '@root/util.js'
import { userCollection } from '@root/database'
import { updateUser } from '@routes/users/put.js'

export default async (req, res) => {
  const userId = req.user.id
  const { newPassword, oldPassword } = req.body
  const user = await getUserdById(userId)

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(400).send({ message: 'The current password is incorrect, please enter it again.' })
  }

  if (bcrypt.compareSync(newPassword, user.password)) {
    return res.status(400).send({ message: 'The new password must be different from the current password.' })
  }

  user.password = bcrypt.hashSync(newPassword, 10)
  await updateUser(user)
  return res.send({ message: 'Password was successfully changed.' })
}

const getUserdById = async (userId) => {
  const user = await userCollection().doc(userId).get()
  return user.data()
}
