import getProjectId from '@routes/projects/_projectId/get.js'
import { execute } from '@root/util.js'
export default async (req, res) => {
  const { projectId } = req.params
  try {
    const project = await execute(getProjectId, { query: { projectId } })
    if (project.status === 404 || !project.body) return res.sendStatus(404)
    const { members } = project.body
    return res.send({ members })
  } catch (error) {
    return res.sendStatus(500)
  }
}
