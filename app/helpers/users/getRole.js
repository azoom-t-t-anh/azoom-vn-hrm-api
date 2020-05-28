import { permissions } from '@root/constants'

export default async function (positionPermissionId = '') {
  return (
    {
      [permissions.admin]: 'admin',
      [permissions.editor]: 'editor',
      [permissions.projectManager]: 'project manager',
      [permissions.user]: 'user'
    }[positionPermissionId] || ''
  )
}
