import { projectCollection } from '@root/database'
export default async (req, res) => {
  const { projectId } = req.query
  try {
    const project = await projectCollection().doc(projectId).get()
    if (!project.exists) return res.sendStatus(404)
    res.send(project.data())
  } catch (error) {
    res.sendStatus(500)
  }
}
