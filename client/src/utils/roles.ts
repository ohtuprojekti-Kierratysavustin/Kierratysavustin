import { UserRole, USER_ROLES } from '../enums/roles'

export const roleExists = (role: string) => {
  return Object.keys(USER_ROLES).includes(role)
}

export const roleIsEqualOrHigher = (role: string, otherRole: UserRole) => {
  let roleToTest = USER_ROLES[role]
  do {
    if (roleToTest.name === otherRole.name) return true
    roleToTest = USER_ROLES[roleToTest.inherits ? roleToTest.inherits : 'NoInherit']
  } while (roleToTest !== undefined)
  return false
}
