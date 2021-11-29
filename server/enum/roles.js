// role key and name should be equal
// inherit should be exactly as role name
const USER_ROLES = {
  Admin: {
    name: 'Admin',
    inherits: 'Moderator'
  },
  Moderator: {
    name: 'Moderator',
    inherits: 'User'
  },
  User: {
    name: 'User',
  }
}

module.exports = { USER_ROLES }