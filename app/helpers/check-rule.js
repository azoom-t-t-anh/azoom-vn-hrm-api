export const isAdmin = roleId => {
  return roleId === process.env.POSITION_ADMIN
}
export const isEditor = roleId => {
  return roleId === process.env.POSITION_EDITOR
}
export const isProjectManager = roleId => {
  return roleId === process.env.POSITION_PROJECTMANAGER
}

export const isUser = roleId => {
  return roleId === process.env.POSITION_USER
}
