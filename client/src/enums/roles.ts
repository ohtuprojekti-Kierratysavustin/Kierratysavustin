export type UserRole = {
  name: string,
  inherits: string | undefined | null
}

const admin: UserRole = {
  name: 'Admin',
  inherits: 'Moderator'
}

const moderator: UserRole = {
  name: 'Moderator',
  inherits: 'User'
}

const user: UserRole = {
  name: 'User',
  inherits: undefined
}

// role key and name should be equal
// inherit should be exactly as role name
export const USER_ROLES: { [key: string]: UserRole } = {
  Admin: admin,
  Moderator: moderator,
  User: user
}