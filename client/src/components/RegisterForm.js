import React, { useState } from 'react'
import registerService from '../services/register'
const RegisterForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    const user = { username, password }
    registerService.createUser(user)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
Username:
          <input type="text" name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
Password:
          <input type="password" name ="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type='submit'>rekisteröidy</button>

      </form>
    </div>
  )
}
export default RegisterForm
