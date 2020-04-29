import _ from 'lodash/fp'
export default (members, newMember) => {
  return members.reduce((members, member) => {
    if (member.id === newMember.id) {
      member = _.defaultsDeep(member, newMember)
    }
    return [...members, member]
  }, [])
}
