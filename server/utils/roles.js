const { USER_ROLES } = require('../enum/roles')

const roleExists = (role) => {
  return Object.keys(USER_ROLES).includes(role)
}

const roleIsEqualOrHigher = (role, otherRole) => {
  let roleToTest = USER_ROLES[role]
  do {
    if (roleToTest.name === otherRole) return true
    roleToTest = USER_ROLES[roleToTest.inherits]
  } while (roleToTest !== undefined)
  return false
}

module.exports.roleExists = roleExists
module.exports.roleIsEqualOrHigher = roleIsEqualOrHigher