export function isRoot (state) {
  return state.name === 'jgvillalba@dentix.es'
}
export function permissions (state) {
  let groups = {}
  if (state.group_users) {
    for (let group of state.group_users) {
      groups[group.groupName] = {
        show: (group.role !== 'guest'),
        create: ['user', 'editor', 'administrator', 'overseeker', 'root'].includes(group.role),
        edit: ['administrator', 'editor', 'overseeker', 'root'].includes(group.role),
        delete: ['overseeker', 'root'].includes(group.role)
      }
    }
  }
  return groups
}
