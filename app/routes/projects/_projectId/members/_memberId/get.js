import { projectCollection } from '@root/database.js'

export default async (req, res) => {
  const { projectId, memberId } = req.params
  try {
    const project = await projectCollection().doc(projectId).get()
    if (!project.exists) return res.sendStatus(404)
    const { members = [] } = project.data()
    if (members.length === 0) return res.sendStatus(404)
    const [ memberProfile ] = members.filter( x => x.id === memberId )
    if (!memberProfile) return res.sendStatus(404)
    res.send(memberProfile)
  } catch (error) {
    res.sendStatus(500)
  }
}
